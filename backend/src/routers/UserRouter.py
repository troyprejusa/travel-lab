from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller, Trip
from utilities.auth_helpers import verify_attendance


user_router = APIRouter(
    prefix='/user'
)

# Upsert a user in database
@user_router.post('/{email}')
async def upsert_user(email: str) -> Traveller | str:
    try:
        user = db_handler.query("""
            INSERT INTO traveller (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;
                         
            SELECT * FROM traveller WHERE email=%s;
        """, (email, email))[0]

        return user
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to upsert user {email}"
            }
        )

# Delete user from database
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
    
    except Exception as error:
        print('ERROR in delete_user:\n', error)
        return JSONResponse(
            status_code=500,
            content={
                "message": f"ERROR: Unable to delete user {request.state.user['email']}"
            }
        )

# Get a user's trips
@user_router.get('/trips')
async def get_trips(request: Request) -> list[Trip] | str:
    try:
        data = db_handler.query("""
            SELECT trip.*, traveller_trip.admin
            FROM trip
            JOIN traveller_trip ON trip.id = traveller_trip.trip_id 
            WHERE traveller_trip.traveller_id = (SELECT id from traveller where email=%s) AND traveller_trip.confirmed=True;
        """, (request.state.user['email'],))
        
        return data
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to get trips for {request.state.user['email']}"
            }
        )

# User leaves a trip
@user_router.delete('/trip/{trip_id}')
async def leave_trip(request: Request, trip_id: str) -> str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        db_handler.query("""
            DELETE FROM traveller_trip WHERE traveller_id = (SELECT id from traveller WHERE email=%s) AND trip_id=%s;
        """, (request.state.user['email'], trip_id))
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Removed user {request.state.user['email']} from trip {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to remove user {request.state.user['email']} from trip {trip_id}"
            }
        )
