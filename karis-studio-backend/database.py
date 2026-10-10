
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

DATABASE_URL = "sqlite:///./karis_studio.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def enable_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

Base = declarative_base()


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    duration = Column(Integer, nullable=False)
    image = Column(String, nullable=False)

    bookings = relationship("Booking", back_populates="service")


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
    status = Column(String, default="pending", nullable=False)

    service = relationship("Service", back_populates="bookings")


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()