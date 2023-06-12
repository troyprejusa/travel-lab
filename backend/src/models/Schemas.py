from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class Traveller(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: str

class Trip(BaseModel):
    id: UUID
    destination: str
    descript: str
    start_date: datetime
    end_date: datetime