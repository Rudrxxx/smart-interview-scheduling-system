from sqlalchemy.orm import Session
from models.recruitment_drive import RecruitmentDrive
from typing import Optional, List


class DriveRepository:
    """Repository Pattern — abstracts all DB ops for RecruitmentDrive"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> RecruitmentDrive:
        drive = RecruitmentDrive(**data)
        self.db.add(drive)
        self.db.commit()
        self.db.refresh(drive)
        return drive

    def get_by_id(self, drive_id: int) -> Optional[RecruitmentDrive]:
        return self.db.query(RecruitmentDrive).filter(RecruitmentDrive.id == drive_id).first()

    def get_all_active(self) -> List[RecruitmentDrive]:
        return self.db.query(RecruitmentDrive).filter(RecruitmentDrive.is_active == 1).all()

    def get_all(self) -> List[RecruitmentDrive]:
        return self.db.query(RecruitmentDrive).all()

    def update(self, drive: RecruitmentDrive, data: dict) -> RecruitmentDrive:
        for key, value in data.items():
            if value is not None:
                setattr(drive, key, value)
        self.db.commit()
        self.db.refresh(drive)
        return drive

    def delete(self, drive: RecruitmentDrive):
        self.db.delete(drive)
        self.db.commit()
