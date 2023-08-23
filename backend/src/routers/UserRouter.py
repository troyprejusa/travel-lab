from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip


user_router = APIRouter(
    prefix='/user'
)

# Delete account
@user_router.delete('/')
async def delete_user(request: Request) -> dict[str, str]:
    try:
        db_handler.query("""
            DELETE FROM traveller WHERE email=%s;
        """, (request.state.user['email'],))
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Deleted user {request.state.user['email']}"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content={
                "message": f"ERROR: Unable to delete user {request.state.user['email']}"
            }
        )

# Get a user's trips
@user_router.get('/trips')
async def get_trips(request: Request) -> list[Trip] | dict[str, str]:
    try:
        data = db_handler.query("""
            SELECT * FROM trip
                WHERE id IN 
                (SELECT trip_id FROM traveller_trip WHERE traveller_id = %s);
        """, (request.state.user['id'],))
        
        return data
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to get trips for {request.state.user['email']}"
            }
        )
    
# Join a trip
@user_router.post('/trips')
async def join_trip(request: Request, trip: Trip) -> dict[str, str]:    
    try:
        db_handler.query("""
            INSERT INTO traveller_trip VALUES (%s, %s);
        """, (request.state.user['id'], trip.id))
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Added user {request.state.user['email']} to trip to {trip.destination}"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to add user {request.state.user['email']} to trip to {trip.destination}"
            }
        )

# Leave a trip
@user_router.delete('/trips')
async def leave_trip(request: Request, trip: Trip) -> dict[str, str]:
    try:
        db_handler.query("""
            DELETE FROM traveller_trip WHERE traveller_id=%s AND trip_id=%s;
        """, (request.state.user['id'], trip.id))
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Removed user {request.state.user['email']} from trip to {trip.destination}"
            }
        )
    
    except Exception as e:
        print(str(e))
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to remove user {request.state.user['email']} from trip to {trip.destination}"
            }
        )

