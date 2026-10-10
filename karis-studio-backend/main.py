
from datetime import datetime, timedelta, timezone
from typing import Literal
import os

import jwt
import phonenumbers
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database import Booking as BookingModel
from database import Service, get_db


# ==========================================
# CONFIGURATION
# ==========================================

load_dotenv(dotenv_path=".env")

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is missing from the .env file."
    )

ADMIN_USERNAME = "admin"

ADMIN_PASSWORD_HASH = (
    "$argon2id$v=19$m=65536,t=3,p=4$"
    "EWp4FucckgPGpxs5RNXbkA$"
    "2JjhwVleHSIvI0kyMlxIzg7xYv4owtYGgJ3PrI3WgdI"
)

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/admin/login"
)


# ==========================================
# JWT AUTHENTICATION
# ==========================================

def create_access_token(username: str, role: str):
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=30)
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm="HS256"
    )


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        username = payload.get("sub")
        role = payload.get("role")

        if not username or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )

        return {
            "username": username,
            "role": role
        }

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
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


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="Karis Studio API",
    description="Karis Studio Salon Booking API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# PYDANTIC SCHEMAS
# ==========================================

class BookingCreate(BaseModel):
    name: str
    service: str
    date: str
    time: str
    phone: str


class AdminLogin(BaseModel):
    username: str
    password: str


class BookingStatus(BaseModel):
    status: Literal[
        "pending",
        "confirmed",
        "completed",
        "cancelled"
    ]


# ==========================================
# HELPER: FORMAT BOOKING RESPONSE
# ==========================================

def booking_to_dict(booking: BookingModel):
    return {
        "id": booking.id,
        "name": booking.name,
        "service": booking.service.title,
        "date": booking.date,
        "time": booking.time,
        "phone": booking.phone,
        "status": booking.status
    }


# ==========================================
# GET ALL BOOKINGS - ADMIN ONLY
# ==========================================

@app.get("/bookings")
def get_bookings(
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    bookings = (
        db.query(BookingModel)
        .order_by(BookingModel.id.desc())
        .all()
    )

    return {
        "bookings": [
            booking_to_dict(booking)
            for booking in bookings
        ]
    }


# ==========================================
# CREATE BOOKING - SAVE TO SQLITE
# ==========================================

@app.post("/bookings")
def save_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db)
):
    # Validate phone number
    try:
        parsed_phone = phonenumbers.parse(
            booking.phone,
            None
        )

        if not phonenumbers.is_valid_number(parsed_phone):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please enter a valid phone number."
            )

    except phonenumbers.NumberParseException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid international phone number."
        )

    normalized_phone = phonenumbers.format_number(
        parsed_phone,
        phonenumbers.PhoneNumberFormat.E164
    )

    # Find the selected service in SQLite
    service = (
        db.query(Service)
        .filter(Service.title == booking.service)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected service was not found in the database."
        )

    # Check whether the time slot is already booked
    existing_booking = (
        db.query(BookingModel)
        .filter(
            BookingModel.date == booking.date,
            BookingModel.time == booking.time,
            BookingModel.status != "cancelled"
        )
        .first()
    )

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This time slot is already booked."
        )

    # Create a database record
    new_booking = BookingModel(
        name=booking.name,
        phone=normalized_phone,
        service_id=service.id,
        date=booking.date,
        time=booking.time,
        status="pending"
    )

    try:
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        return {
            "message": "Booking saved successfully!",
            "status": "success",
            "booking": booking_to_dict(new_booking)
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save booking. Please try again."
        )


# ==========================================
# UPDATE BOOKING STATUS - ADMIN ONLY
# ==========================================

@app.patch("/admin/bookings/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    status_data: BookingStatus,
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    booking = (
        db.query(BookingModel)
        .filter(BookingModel.id == booking_id)
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    booking.status = status_data.status

    try:
        db.commit()
        db.refresh(booking)

        return {
            "message": "Booking status updated successfully",
            "booking": booking_to_dict(booking)
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update booking status."
        )


# ==========================================
# DELETE BOOKING - ADMIN ONLY
# ==========================================

@app.delete("/admin/bookings/{booking_id}")
def delete_booking(
    booking_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    booking = (
        db.query(BookingModel)
        .filter(BookingModel.id == booking_id)
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    try:
        db.delete(booking)
        db.commit()

        return {
            "message": "Booking deleted successfully",
            "booking_id": booking_id
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete booking."
        )


# ==========================================
# ADMIN LOGIN
# ==========================================

@app.post("/admin/login")
def admin_login(admin: AdminLogin):
    if (
        admin.username == ADMIN_USERNAME
        and password_hash.verify(
            admin.password,
            ADMIN_PASSWORD_HASH
        )
    ):
        access_token = create_access_token(
            admin.username,
            "admin"
        )

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


# ==========================================
# GET SERVICES - SQLITE
# ==========================================

@app.get("/services")
def get_services(
    db: Session = Depends(get_db)
):
    services = (
        db.query(Service)
        .order_by(Service.id)
        .all()
    )

    return [
        {
            "id": service.id,
            "category": service.category,
            "title": service.title,
            "description": service.description,
            "price": service.price,
            "duration": service.duration,
            "image": service.image
        }
        for service in services
    ]


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@app.get("/admin/dashboard")
def admin_dashboard(
    current_admin: dict = Depends(get_current_admin)
):
    return {
        "message": "Welcome to Admin Dashboard",
        "username": current_admin["username"],
        "role": current_admin["role"]
    }


# ==========================================
# GET BOOKED SLOTS FOR A DATE
# ==========================================

@app.get("/booked-slots")
def get_booked_slots(
    date: str,
    db: Session = Depends(get_db)
):
    bookings = (
        db.query(BookingModel)
        .filter(
            BookingModel.date == date,
            BookingModel.status != "cancelled"
        )
        .all()
    )

    return {
        "date": date,
        "booked_slots": [
            booking.time for booking in bookings
        ]
    }


# ==========================================
# GET CUSTOMER BOOKINGS BY PHONE
# ==========================================

@app.get("/my-bookings")
def get_my_bookings(
    phone: str,
    db: Session = Depends(get_db)
):
    try:
        parsed_phone = phonenumbers.parse(phone, None)

        if not phonenumbers.is_valid_number(parsed_phone):
            raise HTTPException(
                status_code=400,
                detail="Please enter a valid phone number."
            )

        normalized_phone = phonenumbers.format_number(
            parsed_phone,
            phonenumbers.PhoneNumberFormat.E164
        )

    except phonenumbers.NumberParseException:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid international phone number."
        )

    bookings = (
        db.query(BookingModel)
        .filter(BookingModel.phone == normalized_phone)
        .order_by(BookingModel.id.desc())
        .all()
    )

    return {
        "bookings": [
            booking_to_dict(booking)
            for booking in bookings
        ]
    }