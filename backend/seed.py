
import os
import sys
from datetime import datetime, timedelta

from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

# --- DB connection (reuses same logic as core/database.py) ---
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
elif DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
Session = sessionmaker(bind=engine)
db = Session()

# --- Models (import ALL so SQLAlchemy resolves relationships) ---
from models.base_user import User
from models.recruitment_drive import RecruitmentDrive
from models.application import Application
from models.interview import Interview
from models.evaluation import Evaluation

# --- Password hashing ---
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_users():
    """Create demo users if they don't already exist."""
    demo_users = [
        {"name": "Demo Admin",       "email": "admin@demo.com",       "password": pwd_ctx.hash("demo123"), "role": "admin"},
        {"name": "Demo Student",     "email": "student@demo.com",     "password": pwd_ctx.hash("demo123"), "role": "student"},
        {"name": "Demo Interviewer", "email": "interviewer@demo.com", "password": pwd_ctx.hash("demo123"), "role": "interviewer"},
    ]

    for u in demo_users:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            # Always update password to a valid bcrypt hash
            existing.password = u["password"]
            existing.role = u["role"]
            print(f"  ↻ Updated user: {u['email']}")
        else:
            db.add(User(**u))
            print(f"  + Created user: {u['email']}")

    db.commit()


def seed_drives():
    """Create 3 recruitment drives if the table is empty."""
    count = db.query(RecruitmentDrive).count()
    if count > 0:
        print(f"  ✓ Drives table already has {count} record(s) — skipping.")
        return

    admin = db.query(User).filter(User.email == "admin@demo.com").first()
    if not admin:
        print("  ✗ Admin user not found — cannot seed drives.")
        return

    now = datetime.utcnow()

    drives = [
        {
            "title": "Google SWE Internship 2025",
            "description": "Software engineering internship for final year students",
            "eligibility_criteria": "CGPA > 7.5, CS/IT branch",
            "created_by": admin.id,
            "deadline": now + timedelta(days=30),
            "is_active": 1,
        },
        {
            "title": "Microsoft Product Analyst",
            "description": "Product and business analyst roles for MBA and engineering graduates",
            "eligibility_criteria": "CGPA > 7.0, Any branch",
            "created_by": admin.id,
            "deadline": now + timedelta(days=45),
            "is_active": 1,
        },
        {
            "title": "Goldman Sachs Technology",
            "description": "Technology analyst program for engineering graduates",
            "eligibility_criteria": "CGPA > 8.0, CS/IT/ECE branch",
            "created_by": admin.id,
            "deadline": now + timedelta(days=20),
            "is_active": 1,
        },
    ]

    for d in drives:
        db.add(RecruitmentDrive(**d))
        print(f"  + Created drive: {d['title']}")

    db.commit()


if __name__ == "__main__":
    print("Seeding users...")
    seed_users()
    print("Seeding drives...")
    seed_drives()
    db.close()
    print("Seed complete")
