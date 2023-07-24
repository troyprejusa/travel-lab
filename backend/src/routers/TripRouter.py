from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip, Traveller, Itinerary
from typing import Annotated
from datetime import date, datetime
from models.S3Handler import minio_client


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
    ) -> Trip | str:   

    try:
        # This call must not only create the trip, but must add
        # this user to the trip in the same transaction so there
        # are no dangling trips
        data = db_handler.query("""
            WITH temp_table as (
                INSERT INTO trip 
                (destination, description, start_date, end_date, created_by)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            ) INSERT INTO traveller_trip VALUES (%s, (SELECT id from temp_table)) RETURNING trip_id;
                                
        """, (destination, description, start_date, end_date, request.state.user['email'], request.state.user['id']))
        trip_id = data[0]['trip_id']
        
        trip_data = db_handler.query("""
            SELECT * FROM trip WHERE id=%s;
        """, (trip_id,))[0]
        
        return trip_data
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to create trip to {destination}"
            }
        )

# Delete a trip
@trip_router.delete('/{trip_id}')
async def delete_trip(request: Request, trip_id: str) -> str:
    # TODO: Check if the delete requester is an admin on this trip
    try:
        db_handler.query("""
            DELETE FROM trip WHERE id = %s;
        """, (trip_id,))

        return JSONResponse(
            status_code=200,
            content = {
                "message": f"SUCCESS: Deleted trip {trip_id}"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to delete trip {trip_id}"
            }
        )

# Get contact info for travellers on this trip
@trip_router.get('/{trip_id}/contacts')
async def get_contact_info(trip_id: str) ->  list[Traveller] | str:
    try:
        travellers = db_handler.query("""
            SELECT * from traveller WHERE id in (SELECT traveller_id FROM traveller_trip WHERE trip_id=%s);
            """, (trip_id,))
        
        return travellers

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to find travellers for trip id {trip_id}"
            }
        )


# Get itinerary for this trip
@trip_router.get('/{trip_id}/itinerary')
async def get_itinerary_info(trip_id: str) -> list[Itinerary] | str:
    try:
        itinerary = db_handler.query("""
            SELECT * FROM itinerary WHERE trip_id = %s
        """, (trip_id,))

        return itinerary

    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to retrieve itinerary for trip id {trip_id}"
            }
        )

# Add itinerary item for this trip
@trip_router.post('/{trip_id}/itinerary')
async def add_itinerary_info(
    request: Request,
    trip_id: str,
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    start_time: Annotated[datetime, Form()],
    end_time: Annotated[datetime, Form()]
    ) ->  str:

    try:
        db_handler.query("""
        INSERT INTO itinerary (trip_id, title, description, start_time, end_time, created_by)
        VALUES (%s, %s, %s, %s, %s, %s);
        """, (trip_id, title, description, start_time, end_time, request.state.user['email']))
     
        return JSONResponse(
            status_code=200,
            content= {
                "message": "SUCCESS: Created itinerary stop"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to submit itinerary stop for trip id {trip_id}"
            }
        )


