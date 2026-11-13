'''
Note that the string-formatted ids below are often UUIDs. 
However, the UUIDs are treated like strings throughout the 
code base, and are also not serializable for WebSockets. 
Rather than pepper the codebase with conversions, 
the UUID is converted to a string by DatabaseHander.query
'''

from pydantic import BaseModel
from datetime import date, datetime


# --------------- DATABASE TYPES --------------- #
# These match the SQL tables 1-1

class UserModel(BaseModel):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    email: str
    phone: str | None = None
    
class TripModel(BaseModel):
    id: str
    destination: str
    description: str | None = None
    start_date: date
    end_date: date
    vacation_type: str
    created_at: datetime
    created_by: str

class ItineraryModel(BaseModel):
    id: int
    trip_id: str
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    created_at: datetime
    created_by: str

class PackingModel(BaseModel):
    id: int
    trip_id: str
    item: str
    quantity: int
    description: str | None = None
    created_at: datetime
    created_by: str
    packed_by: str | None = None

class MessageModel(BaseModel):
    id: int
    trip_id: str
    content: str
    created_at: datetime
    created_by: str

# --------------- COMPOSITE DATABASE TYPES --------------- #
# These types are a result of JOINs on SQL tables

class TravellerResponse(BaseModel):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    email: str
    phone: str | None = None
    confirmed: bool
    admin: bool

# --------------- FASTAPI I/O TYPES --------------- #
# These types are used in I/O of FastAPI calls

class PollVoteResponse(BaseModel):
    option_id: int
    option: str
    votes: list[str]

class PollResponse(BaseModel):
    poll_id: int
    title: str
    description: str | None = None
    created_at: datetime
    created_by: str
    options: list[PollVoteResponse]

# --------------- WEBSOCKET TYPES --------------- #
# These types are used in websocket functionality, and
# SHOULD be used to verify validity before handling on 
# the backend

class NewItineraryWS(BaseModel):
    trip_id: str
    created_by: str
    title: str
    description: str | None = None
    start_time: str
    end_time: str

class ItineraryDeleteWS(BaseModel):
    trip_id: str
    itinerary_id: int

class NewPollWS(BaseModel):
    trip_id: str
    created_by: str
    title: str
    description: str | None = None
    options: list[str]

class PollVoteWS(BaseModel):
    trip_id: str
    poll_id: int
    option_id: int
    voted_by: str

class PollDeleteWS(BaseModel):
    trip_id: str
    poll_id: int

class NewPackingWS(BaseModel):
    trip_id: str
    item: str
    quantity: int
    description: str | None = None
    created_by: str

class PackingClaimWS(BaseModel):
    trip_id: str
    item_id: int
    email: str

class PackingUnclaimWS(BaseModel):
  trip_id: str
  item_id: int

class PackingDeleteWS(BaseModel):
  trip_id: str
  item_id: int

class MessageWS(BaseModel):
    trip_id: str
    content: str
    created_by: str