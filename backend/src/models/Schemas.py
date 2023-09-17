from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime


class Traveller(BaseModel):
    id: UUID
    first_name: str | None = None
    last_name: str | None = None
    email: str
    phone: str | None = None

class Trip(BaseModel):
    id: UUID
    destination: str
    description: str
    start_date: date
    end_date: date
    created_at: datetime
    created_by: str
    admin: bool

class Itinerary(BaseModel):
    id: int
    trip_id: UUID
    title: str
    description: str | None = None
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

class Packing(BaseModel):
    id: int
    trip_id: UUID
    item: str
    quantity: int
    description: str | None = None
    created_at: datetime
    created_by: str
    packed_by: str | None = None

class NewPollBody(BaseModel):
    title: str
    description: str | None = None
    options: list[str]


class PollVoteBody(BaseModel):
    option_id: int
    option: str
    votes: list[str]

class PollResponseBody(BaseModel):
    poll_id: int
    title: str
    description: str | None = None
    created_at: datetime
    created_by: str
    options: list[PollVoteBody]
