from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip
from typing import Annotated
from datetime import date


trip_router = APIRouter(
    prefix='/trip'
)

# Create a trip
@trip_router.post('/')
async def create_trip(
    request: Request,
    destination: Annotated[str, Form()],
    description: Annotated[str, Form()],
    start_date: Annotated[date, Form()],
    end_date: Annotated[date, Form()]
    ) -> str:   

    try:
        # This call must not only create the trip, but must add
        # this user to the trip in the same transaction so there
        # are no dangling trips
        db_handler.query("""
            INSERT INTO traveller_trip VALUES (
                %s, 
                (INSERT INTO trip 
                (destination, description, start_date, end_date)
                VALUES (%s, %s, %s, %s)
                RETURNING id;)
            );
        """, (request.state.user['id'], destination, description, start_date, end_date))
        
        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Created trip to {destination}"
            }
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to create trip to {destination}"
            }
        )

# Delete a trip
@trip_router.delete('/')
async def delete_trip(request: Request, trip: Trip) -> str:
    # TODO: Check if the delete requester is an admin on this trip
    try:
        db_handler.query("""
            DELETE FROM trip WHERE id = %s;
        """, (str(trip.id),))

        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Deleted trip {trip.id}"
            }
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to delete trip {trip.id}"
            }
        )

# Get contact info for trallers on this trip
@trip_router.get('/contacts/{trip_id}')
async def get_contact_info(trip_id: str) ->  str:
    try:
        travellers = db_handler.query("""
            SELECT * from traveller WHERE id in (SELECT traveller_id FROM traveller_trip WHERE trip_id=%s);
            """, (trip_id,))
        
        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Found users for trip id {trip_id}",
                "travellers": travellers
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to find travellers for trip id {trip_id}"
            }
        )


