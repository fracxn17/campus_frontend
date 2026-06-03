# CampusLegacy - Alumni Connect Application

## Commands to Run the Project

### 1. Run the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install fastapi uvicorn sqlalchemy python-dotenv python-jose[cryptography] bcrypt python-multipart

# Start the FastAPI server on port 5000
uvicorn main:app --host 127.0.0.1 --port 5000 --reload
```

### 2. Run the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server on port 5173
npm run dev
```
