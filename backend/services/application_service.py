from sqlalchemy.orm import Session
from repositories.application_repository import ApplicationRepository
from repositories.drive_repository import DriveRepository
from fastapi import HTTPException


class ApplicationService:
    """Encapsulates all application business logic."""

    def __init__(self, db: Session):
        self.repo = ApplicationRepository(db)
        self.drive_repo = DriveRepository(db)

    def validate_application(self, student_id: int, drive_id: int):
        drive = self.drive_repo.get_by_id(drive_id)
        if not drive:
            raise HTTPException(status_code=404, detail="Drive not found")
        if drive.is_active != 1:
            raise HTTPException(status_code=400, detail="Drive is no longer active")
        existing = self.repo.get_by_student_and_drive(student_id, drive_id)
        if existing:
            raise HTTPException(status_code=400, detail="Already applied to this drive")
        return drive

    def save_application(self, student_id: int, drive_id: int):
        self.validate_application(student_id, drive_id)
        return self.repo.create(student_id=student_id, drive_id=drive_id)

    def get_student_applications(self, student_id: int):
        return self.repo.get_by_student(student_id)

    def get_drive_applications(self, drive_id: int):
        return self.repo.get_by_drive(drive_id)

    def update_status(self, app_id: int, status: str):
        app = self.repo.get_by_id(app_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return self.repo.update_status(app, status)

    def get_all(self):
        return self.repo.get_all()
