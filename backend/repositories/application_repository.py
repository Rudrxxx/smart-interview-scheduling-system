from sqlalchemy.orm import Session
from models.application import Application
from typing import Optional, List


class ApplicationRepository:
    """Repository Pattern — abstracts all DB ops for Application"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, student_id: int, drive_id: int) -> Application:
        app = Application(student_id=student_id, drive_id=drive_id)
        self.db.add(app)
        self.db.commit()
        self.db.refresh(app)
        return app

    def get_by_id(self, app_id: int) -> Optional[Application]:
        return self.db.query(Application).filter(Application.id == app_id).first()

    def get_by_student(self, student_id: int) -> List[Application]:
        return self.db.query(Application).filter(Application.student_id == student_id).all()

    def get_by_drive(self, drive_id: int) -> List[Application]:
        return self.db.query(Application).filter(Application.drive_id == drive_id).all()

    def get_by_student_and_drive(self, student_id: int, drive_id: int) -> Optional[Application]:
        return self.db.query(Application).filter(
            Application.student_id == student_id,
            Application.drive_id == drive_id
        ).first()

    def update_status(self, app: Application, status: str) -> Application:
        app.status = status
        self.db.commit()
        self.db.refresh(app)
        return app

    def get_all(self) -> List[Application]:
        return self.db.query(Application).all()

    def save(self, app: Application) -> Application:
        self.db.add(app)
        self.db.commit()
        self.db.refresh(app)
        return app
