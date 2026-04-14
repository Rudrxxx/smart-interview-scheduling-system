from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine

# Import all models so SQLAlchemy creates the tables
from models.base_user import User
from models.recruitment_drive import RecruitmentDrive
from models.application import Application
from models.interview import Interview
from models.evaluation import Evaluation

# Import controllers
from controllers.auth_controller import router as auth_router
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
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(auth_router)
app.include_router(drive_router)
app.include_router(application_router)
app.include_router(interview_router)
app.include_router(evaluation_router)
app.include_router(result_router)


@app.get("/")
def root():
    return {"message": "Smart Interview Scheduling System API is running!"}
