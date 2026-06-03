from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from Database.Alumini_DB import SessionLocal
from Models.Alumini_login import LOGIN, AluminiProfile

#Token generation----------------------------------------------------------------------------------------
from jose import jwt
from datetime import datetime, timedelta
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

#Security_Bouncer----------------------------------------------------------------------------------------
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from jose import JWTError

import bcrypt

security = HTTPBearer()

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
#--------------------------------------------------------------------------------------------------------
#running frontend
from fastapi.middleware.cors import CORSMiddleware

#--------------------------------------------------------------------------------------------------------

class LogType(BaseModel):
    name: str
    email: str
    password : str

class AluminiProfileCreate(BaseModel):
    batch : str
    department : str
    company : str
    designation : str
    skills : str
    linkedin : str
    location : str
app= FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
@app.post("/register")
def alumini_reg(info:LogType):
    db= SessionLocal()
    db_is_there = db.query(LOGIN).filter(LOGIN.email == info.email).first()
    if db_is_there:
        raise HTTPException(status_code = 400, detail = "Email already Exist")

    hashed_pass = bcrypt.hashpw(info.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_item= LOGIN(name= info.name, email= info.email, password = hashed_pass)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    db.close()
    return db_item

@app.post("/login")
def credential(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    db_item = db.query(LOGIN).filter(LOGIN.email == form_data.username).first()
    if not db_item:
        raise HTTPException(status_code = 404, detail = "User not found!!")
    if not bcrypt.checkpw(form_data.password.encode('utf-8'), db_item.password.encode('utf-8')):
        raise HTTPException(status_code = 401, detail = "Wrong Credentials")

    payload = {
        "sub" : str(db_item.alumini_id),
        "exp" : datetime.utcnow() + timedelta(minutes =30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm = ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

#token verification function
def verify_token(credentials:HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code = 404, detail = "Invalid token")

@app.get("/Alumini_Home/{id_}")
def home(id_:int, payload: dict = Depends(verify_token)):
    db=SessionLocal()
    info = db.query(LOGIN).filter(LOGIN.alumini_id == id_).first()
    db.close()
    return info

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "login")
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code = 401, detail = "Invalid Token")
        return user_id
    except:
        raise HTTPException(status_code = 401, detail = "Invalid Token")


@app.post("/alumini/profile")
def create_profile(profile:AluminiProfileCreate, user_id:int= Depends(get_current_user)):
    db = SessionLocal()
    existing_profile = db.query(AluminiProfile).filter(AluminiProfile.user_id == user_id).first()
    if existing_profile:
        raise HTTPException(status_code = 400, detail = "Profile already Exist")

    new_profile = AluminiProfile(user_id=user_id, batch=profile.batch, department= profile.department, company=profile.company, designation=profile.designation, skills=profile.skills , linkedin=profile.linkedin, location=profile.location )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    db.close()

    return {"message": "Profile created successfully", "profile": new_profile}