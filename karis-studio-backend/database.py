
import os

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    event,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker


# --------------------------------------------------
# DATABASE CONFIGURATION
# --------------------------------------------------

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./karis_studio.db",
)

# Check which database is being used.
is_sqlite = DATABASE_URL.startswith("sqlite")

# SQLite needs check_same_thread=False.
# PostgreSQL does not use this argument.
connect_args = (
    {"check_same_thread": False}
    if is_sqlite
    else {}
)

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)


# --------------------------------------------------
# SQLITE FOREIGN KEY CONFIGURATION
# --------------------------------------------------

# SQLite understands PRAGMA foreign_keys.
# PostgreSQL enforces foreign keys natively, so
# this listener must only be registered for SQLite.

if is_sqlite:

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()

        try:
            cursor.execute("PRAGMA foreign_keys=ON")
        finally:
            cursor.close()


# --------------------------------------------------
# DATABASE SESSION
# --------------------------------------------------

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

Base = declarative_base()


# --------------------------------------------------
# SERVICE MODEL
# --------------------------------------------------

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    duration = Column(Integer, nullable=False)
    image = Column(String, nullable=False)

    bookings = relationship(
        "Booking",
        back_populates="service",
    )


# --------------------------------------------------
# BOOKING MODEL
# --------------------------------------------------

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    service_id = Column(
        Integer,
        ForeignKey("services.id"),
        nullable=False,
    )

    date = Column(String, nullable=False)
    time = Column(String, nullable=False)

    status = Column(
        String,
        default="pending",
        nullable=False,
    )

    service = relationship(
        "Service",
        back_populates="bookings",
    )


# --------------------------------------------------
# CREATE TABLES
# --------------------------------------------------

Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# DATABASE DEPENDENCY FOR FASTAPI
# --------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
