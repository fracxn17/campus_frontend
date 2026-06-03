from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL="postgresql://postgres:post123@localhost:5432/Alumini_db"
engine= create_engine(DATABASE_URL)
SessionLocal= sessionmaker(bind= engine)