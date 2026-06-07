from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from Database.Alumini_DB import SessionLocal
from Models.Alumini_login import LOGIN, AluminiProfile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

# Token generation settings
SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey_super_secure_123")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# Dynamically set root_path when running in serverless environments (Netlify/AWS Lambda, but not Vercel)
root_path = "/.netlify/functions/api" if ((os.getenv("LAMBDA_TASK_ROOT") or os.getenv("NETLIFY")) and not os.getenv("VERCEL")) else ""
app = FastAPI(root_path=root_path)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC SCHEMAS ---

class LogType(BaseModel):
    name: str
    email: str
    password: str

class AluminiProfileCreate(BaseModel):
    batch: str
    department: str
    company: str
    designation: str
    skills: str
    linkedin: str
    location: str

# New schemas matching the React Frontend requests
class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str
    role: str = "student"
    gender: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileUpdateRequest(BaseModel):
    id: int
    fullName: str
    phone: str = ""
    batch: str = ""
    department: str = ""
    degree: str = ""
    location: str = ""
    rollNumber: str = ""
    gender: str = ""

class RoleUpdateRequest(BaseModel):
    role: str

# --- HELPER FUNCTIONS ---

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid Token")

def make_unified_user(user: LOGIN):
    # Ensure profile exists
    profile = user.profile
    if not profile:
        profile_data = {
            "batch": "",
            "department": "",
            "company": "",
            "designation": "",
            "skills": "",
            "linkedin": "",
            "location": "",
            "degree": "",
            "rollNumber": "",
            "phone": ""
        }
    else:
        profile_data = {
            "batch": profile.batch or "",
            "department": profile.department or "",
            "company": profile.company or "",
            "designation": profile.designation or "",
            "skills": profile.skills or "",
            "linkedin": profile.linkedin or "",
            "location": profile.location or "",
            "degree": profile.degree or "",
            "rollNumber": profile.rollNumber or "",
            "phone": profile.phone or "",
            "gender": profile.gender or ""
        }
    
    return {
        "id": user.alumini_id,
        "fullName": user.name,
        "email": user.email,
        "role": user.role or "student",
        **profile_data
    }

# --- NEW REACT FRONTEND COMPATIBILITY ENDPOINTS ---

@app.get("/")
def main():
    return {
        "health": "ok",
        "message": "backend server is up and running",
        "docs": "/docs"
    }

@app.post("/api/register")
def api_register(info: RegisterRequest):
    db = SessionLocal()
    try:
        existing_user = db.query(LOGIN).filter(LOGIN.email == info.email).first()
        if existing_user:
            raise HTTPException(status_code=409, detail="An account with this email already exists. Please login instead.")
        
        hashed = hash_password(info.password)
        new_user = LOGIN(
            name=info.fullName,
            email=info.email,
            password=hashed,
            role=info.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create corresponding empty profile
        new_profile = AluminiProfile(
            user_id=new_user.alumini_id,
            batch="",
            department="",
            company="",
            designation="",
            skills="",
            linkedin="",
            location="",
            degree="",
            rollNumber="",
            phone="",
            gender=info.gender
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "Account created successfully!",
            "user": make_unified_user(new_user)
        }
    finally:
        db.close()

@app.post("/api/login")
def api_login(info: LoginRequest):
    db = SessionLocal()
    try:
        user = db.query(LOGIN).filter(LOGIN.email == info.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Account not found! Create a new account to get started.")
        
        if not check_password(info.password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")
        
        return {
            "success": True,
            "message": "Login successful!",
            "user": make_unified_user(user)
        }
    finally:
        db.close()

@app.post("/api/user/update")
def api_update_user(info: ProfileUpdateRequest):
    db = SessionLocal()
    try:
        user = db.query(LOGIN).filter(LOGIN.alumini_id == info.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.name = info.fullName
        
        profile = user.profile
        if not profile:
            profile = AluminiProfile(user_id=user.alumini_id)
            db.add(profile)
            
        profile.phone = info.phone
        profile.batch = info.batch
        profile.department = info.department
        profile.degree = info.degree
        profile.location = info.location
        profile.rollNumber = info.rollNumber
        profile.gender = info.gender
        
        db.commit()
        db.refresh(user)
        
        return {
            "success": True,
            "message": "Profile updated successfully!",
            "user": make_unified_user(user)
        }
    finally:
        db.close()

@app.get("/api/users/{id_}")
def api_get_user(id_: int):
    db = SessionLocal()
    try:
        user = db.query(LOGIN).filter(LOGIN.alumini_id == id_).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "success": True,
            "user": make_unified_user(user)
        }
    finally:
        db.close()

@app.get("/api/users")
def api_get_all_users():
    db = SessionLocal()
    try:
        users = db.query(LOGIN).all()
        return {
            "success": True,
            "users": [make_unified_user(u) for u in users]
        }
    finally:
        db.close()

# Admin Stats and Admin Management Endpoints
@app.get("/api/admin/stats")
def api_admin_stats():
    db = SessionLocal()
    try:
        total_alumni = db.query(LOGIN).filter(LOGIN.role == "alumni").count()
        total_students = db.query(LOGIN).filter(LOGIN.role == "student").count()
        total_users = db.query(LOGIN).count()
        return {
            "success": True,
            "totalAlumni": total_alumni,
            "activeMembers": total_users,
            "eventsConducted": 5 # Static/Mock event count
        }
    finally:
        db.close()

@app.get("/api/admin/users")
def api_admin_users():
    db = SessionLocal()
    try:
        users = db.query(LOGIN).all()
        # Return simplified details for the admin table
        admin_users_list = []
        for u in users:
            admin_users_list.append({
                "id": u.alumini_id,
                "name": u.name,
                "email": u.email,
                "batch": u.profile.batch if u.profile else "",
                "status": "Active", # Default Status
                "role": u.role or "student"
            })
        return {
            "success": True,
            "users": admin_users_list
        }
    finally:
        db.close()

@app.delete("/api/admin/users/{id_}")
def api_admin_delete_user(id_: int):
    db = SessionLocal()
    try:
        user = db.query(LOGIN).filter(LOGIN.alumini_id == id_).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return {
            "success": True,
            "message": "User deleted successfully."
        }
    finally:
        db.close()

@app.put("/api/admin/users/{id_}/role")
def api_admin_update_role(id_: int, info: RoleUpdateRequest):
    db = SessionLocal()
    try:
        user = db.query(LOGIN).filter(LOGIN.alumini_id == id_).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.role = info.role
        db.commit()
        return {
            "success": True,
            "message": f"User role updated to {info.role} successfully."
        }
    finally:
        db.close()

# --- LEGACY HTML COMPATIBILITY ENDPOINTS ---

@app.post("/register")
def alumini_reg(info: LogType):
    db = SessionLocal()
    try:
        db_is_there = db.query(LOGIN).filter(LOGIN.email == info.email).first()
        if db_is_there:
            raise HTTPException(status_code=400, detail="Email already Exist")

        hashed_pass = hash_password(info.password)
        db_item = LOGIN(name=info.name, email=info.email, password=hashed_pass, role="alumni")
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        # Create correspoding empty profile
        new_profile = AluminiProfile(user_id=db_item.alumini_id)
        db.add(new_profile)
        db.commit()
        
        return db_item
    finally:
        db.close()

@app.post("/login")
def credential(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    try:
        db_item = db.query(LOGIN).filter(LOGIN.email == form_data.username).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="User not found!!")
        if not check_password(form_data.password, db_item.password):
            raise HTTPException(status_code=401, detail="Wrong Credentials")

        payload = {
            "sub": str(db_item.alumini_id),
            "exp": datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token, "token_type": "bearer"}
    finally:
        db.close()

@app.get("/Alumini_Home/{id_}")
def home(id_: int, payload: dict = Depends(verify_token)):
    db = SessionLocal()
    try:
        info = db.query(LOGIN).filter(LOGIN.alumini_id == id_).first()
        return info
    finally:
        db.close()

@app.post("/alumini/profile")
def create_profile(profile: AluminiProfileCreate, user_id: int = Depends(get_current_user)):
    db = SessionLocal()
    try:
        existing_profile = db.query(AluminiProfile).filter(AluminiProfile.user_id == user_id).first()
        if existing_profile and existing_profile.batch:
            raise HTTPException(status_code=400, detail="Profile already Exist")

        if not existing_profile:
            existing_profile = AluminiProfile(user_id=user_id)
            db.add(existing_profile)

        existing_profile.batch = profile.batch
        existing_profile.department = profile.department
        existing_profile.company = profile.company
        existing_profile.designation = profile.designation
        existing_profile.skills = profile.skills
        existing_profile.linkedin = profile.linkedin
        existing_profile.location = profile.location
        
        db.commit()
        db.refresh(existing_profile)
        return {"message": "Profile created successfully", "profile": existing_profile}
    finally:
        db.close()