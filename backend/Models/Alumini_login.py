from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from Database.Alumini_DB import engine

Base = declarative_base()

class LOGIN(Base):
    __tablename__ = "alumini_logInfo"
    alumini_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String(225), unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False)  # student, alumni, admin

    profile = relationship("AluminiProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class AluminiProfile(Base):
    __tablename__ = "alumini_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("alumini_logInfo.alumini_id"), unique=True)
    batch = Column(String, default="")
    department = Column(String, default="")
    company = Column(String, default="")
    designation = Column(String, default="")
    skills = Column(String, default="")
    linkedin = Column(String, default="")
    location = Column(String, default="")
    degree = Column(String, default="")
    rollNumber = Column(String, default="")
    phone = Column(String, default="")
    gender = Column(String, default="")

    user = relationship("LOGIN", back_populates="profile")

Base.metadata.create_all(bind=engine)