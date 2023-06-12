from fastapi import APIRouter
from models.DatabaseHandler import db_handler
from models.Schemas import Trip

user_router = APIRouter(
    prefix='/user'
)

@user_router.get('/trips')
async def get_trips(id: str) -> list[Trip]:
    data = db_handler.query("""
        SELECT * FROM trip
            WHERE id IN 
            (SELECT trip_id FROM traveller_trip WHERE traveller_id = %s) 
    """, (id,))
    
    return data
