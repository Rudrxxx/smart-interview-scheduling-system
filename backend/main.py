from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from core.database import Base, engine

# Import all models so SQLAlchemy creates the tables
from models.base_user import User
from models.recruitment_drive import RecruitmentDrive
from models.application import Application
from models.interview import Interview
from models.evaluation import Evaluation

# Import controllers
from controllers.user_controller import router as user_router
from controllers.drive_controller import router as drive_router
from controllers.application_controller import router as application_router
from controllers.interview_controller import router as interview_router
from controllers.evaluation_controller import router as evaluation_router
from controllers.result_controller import router as result_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Interview Scheduling System API",
    description="Full-stack campus recruitment platform — Backend API",
    version="1.0.0"
)

# CORS — allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(user_router)
app.include_router(drive_router)
app.include_router(application_router)
app.include_router(interview_router)
app.include_router(evaluation_router)
app.include_router(result_router)


@app.on_event("startup")
def startup_event():
    import os
    if os.getenv("AUTO_SEED") == "True":
        print("Auto-seeding database...")
        try:
            from seed import seed_users, seed_drives
            seed_users()
            seed_drives()
            print("Auto-seed complete.")
        except Exception as e:
            print(f"Auto-seed failed: {e}")


@app.get("/")
def root():
    return {"message": "Smart Interview Scheduling System API is running!"}
