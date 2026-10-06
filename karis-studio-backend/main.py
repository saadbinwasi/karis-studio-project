from fastapi import FastAPI
from pydantic import BaseModel 
from fastapi.middleware.cors import CORSMiddleware
import json
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


ADMIN_USERNAME = "admin"

ADMIN_PASSWORD_HASH = "$argon2id$v=19$m=65536,t=3,p=4$EWp4FucckgPGpxs5RNXbkA$2JjhwVleHSIvI0kyMlxIzg7xYv4owtYGgJ3PrI3WgdI"




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
def get_bookings():

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

    if admin.username != ADMIN_USERNAME:
        return {
            "message": "Invalid username or password",
            "success": False
        }

    if not password_hash.verify(
        admin.password,
        ADMIN_PASSWORD_HASH
    ):
        return {
            "message": "Invalid username or password",
            "success": False
        }

    return {
        "message": "Login successful",
        "success": True
    }
    
@app.get("/services")
def get_services():
    with open("services.json", "r") as f:
        services = json.load(f)

    return  services