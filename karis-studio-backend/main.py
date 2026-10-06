from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel 
from fastapi.middleware.cors import CORSMiddleware
import json
from pwdlib import PasswordHash
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer


password_hash = PasswordHash.recommended()
load_dotenv(dotenv_path=".env")
SECRET_KEY = os.getenv("SECRET_KEY")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")


ADMIN_USERNAME = "admin"

ADMIN_PASSWORD_HASH = "$argon2id$v=19$m=65536,t=3,p=4$EWp4FucckgPGpxs5RNXbkA$2JjhwVleHSIvI0kyMlxIzg7xYv4owtYGgJ3PrI3WgdI"


def create_access_token(username: str, role: str):

    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm="HS256"
    )

    return token

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        username = payload.get("sub")
        role = payload.get("role")

        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )

        return {
            "username": username,
            "role": role
        }

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def get_current_admin(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user

app = FastAPI(
    title="Karis Studio API",
    description="Karis Studio Salon Booking API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Booking(BaseModel):
    name: str
    service: str
    date: str
    time: str
    phone: str
    
class AdminLogin(BaseModel):
    password: str
    username: str



@app.get("/bookings")
def get_bookings(
    current_admin: dict = Depends(get_current_admin)
):

    with open("booking.json", "r") as f:
        bookings = json.load(f)

    return {
        "bookings": bookings
    }
    
    
@app.post("/bookings")
def save_bookings(booking: Booking):

    with open("booking.json", "r") as f:
        bookings = json.load(f)

    new_booking = {
        "id": len(bookings) + 1,
        "name": booking.name,
        "service": booking.service,
        "date": booking.date,
        "time": booking.time,
        "phone": booking.phone
    }

    bookings.append(new_booking)

    with open("booking.json", "w") as f:
        json.dump(bookings, f, indent=4)

    return {
        "message": "Booking saved successfully!",
        "status": "running",
        "booking": new_booking
    }

@app.post("/admin/login")
def admin_login(admin: AdminLogin):

    if admin.username == ADMIN_USERNAME and password_hash.verify(
        admin.password,
        ADMIN_PASSWORD_HASH
    ):

        access_token = create_access_token(admin.username, "admin")

        return {
            "message": "Login successful",
            "success": True,
            "access_token": access_token,
            "token_type": "bearer"
        }

    return {
        "message": "Invalid username or password",
        "success": False
    }
    
@app.get("/services")
def get_services():
    with open("services.json", "r") as f:
        services = json.load(f)

    return  services

@app.get("/admin/dashboard")
def admin_dashboard(
    current_admin: dict = Depends(get_current_admin)
):
    return {
        "message": "Welcome to Admin Dashboard",
        "username": current_admin["username"],
        "role": current_admin["role"]
    }
    

