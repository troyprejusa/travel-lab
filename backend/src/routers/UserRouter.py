from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip

user_router = APIRouter(
    prefix='/user'
)

# Get a user's trips
@user_router.get('/trips')
async def get_trips(userid: str) -> list[Trip] | str:
    try:
        data = db_handler.query("""
            SELECT * FROM trip
                WHERE id IN 
                (SELECT trip_id FROM traveller_trip WHERE traveller_id = %s) 
        """, (userid,))
        
        return data
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to find user {userid}"
            }
        )

# Delete a trip
@user_router.delete('/trips')
async def get_trips(userid: str, trip: Trip) -> str:
    # TODO: Check if the user is an admin on this trip
    
    try:
        db_handler.query("""
            DELETE FROM trip WHERE id = %s;
        """, (str(trip.id),))
        
        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Deleted trip {trip.destination}"
            }
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to to delete trip {trip.destination}"
            }
        )

