from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime


# DATABASE SCHEMAS
# -----------------------------------
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

class Poll(BaseModel):
    id: int
    trip_id: UUID
    title: str
    anonymous: bool
    created_at: datetime
    created_by: str

class PollOption(BaseModel):
    id: int
    poll_id: int
    option: str

class PollVote(BaseModel):
    id: int
    poll_id: int
    vote: str
    voted_at: datetime
    voted_by: str


# BODY DEFINTIONS
# -----------------------------------
class NewPollBody(BaseModel):
    title: str
    anonymous: bool
    options: list[str]