from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime

class Traveller(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: str

class Trip(BaseModel):
    id: UUID
    destination: str
    description: str
    start_date: date
    end_date: date
    created_at: datetime
    created_by: str

class Itinerary(BaseModel):
    id: int
    trip_id: UUID
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    created_by: str

class Message(BaseModel):
    id: int
    trip_id: UUID
    content: str
    created_at: datetime
    created_by: str
