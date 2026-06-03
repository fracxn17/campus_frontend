from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from Database.Alumini_DB import engine

Base= declarative_base()
class LOGIN(Base):
    __tablename__= "alumini_logInfo"
    alumini_id = Column(Integer, primary_key= True, index= True)
    name = Column(String, nullable= False)
    email = Column(String(225), unique= True, nullable= False)
    password = Column(String,nullable= False)

    profile = relationship("AluminiProfile", back_populates = "user", uselist = False)
class AluminiProfile(Base):
    __tablename__ = "alumini_profiles"
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("alumini_logInfo.alumini_id"),unique = True)
    batch = Column(String)
    department = Column(String)
    company = Column(String)
    designation =  Column(String)
    skills =  Column(String)
    linkedin =  Column(String)
    location = Column(String)

    user = relationship("LOGIN", back_populates = "profile")


Base.metadata.create_all(bind=engine)