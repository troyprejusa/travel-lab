from pydantic import BaseModel
from uuid import UUID
from datetime import date

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