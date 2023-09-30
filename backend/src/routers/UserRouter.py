from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import TravellerResponse, TripResponse
from utilities.auth_helpers import verify_attendance, verify_admin


user_router = APIRouter(
    prefix='/user'
)

# Upsert a user in database
@user_router.post('/{email}')
async def upsert_user(email: str) -> TravellerResponse | str:
    try:
        user = db_handler.query("""
            INSERT INTO traveller (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;
                         
            SELECT traveller.*, traveller_trip.confirmed, traveller_trip.admin
            FROM traveller
            JOIN traveller_trip ON traveller.id = traveller_trip.traveller_id
            WHERE email=%s;
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
async def get_trips(request: Request) -> list[TripResponse] | str:
    try:
        data = db_handler.query("""
            SELECT * FROM trip WHERE id in (
                SELECT trip_id FROM traveller_trip WHERE 
                    confirmed = TRUE AND 
                    traveller_id = (
                    SELECT id FROM traveller WHERE email = %s
                )
            );
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

# User requests to join trip
@user_router.post('/trips/{trip_id}')
async def request_join_trip(request: Request, trip_id: str) -> dict[str, str]:
    try:
        db_handler.query("""
            INSERT INTO traveller_trip VALUES ((SELECT id from traveller where email=%s), %s, False, False);
        """, (request.state.user['email'], trip_id))
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Submitted request for user {request.state.user['email']} to join {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable for user {request.state.user['email']} to request joining trip {trip_id}"
            }
        )
    
# User leaves a trip
@user_router.delete('/trips/{trip_id}')
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
    
# Trip admin accepts request to join trip
@user_router.patch('/trips/{trip_id}/{requestor_id}')
async def accept_join_trip(request: Request, trip_id: str, requestor_id: str) -> str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.query("""
            UPDATE traveller_trip SET confirmed=TRUE WHERE traveller_id=%s AND trip_id=%s;
        """, (requestor_id, trip_id))
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Accepted user {requestor_id} into trip {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable accept user {requestor_id} for trip {trip_id}"
            }
        )

# Trip admin removes (possibly pending) user from trip
@user_router.delete('/trips/{trip_id}/{requestor_id}')
async def remove_from_trip(request: Request, trip_id: str, requestor_id: str) -> str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.query("""
            DELETE FROM traveller_trip WHERE traveller_id=%s AND trip_id=%s;
        """, (requestor_id, trip_id))
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Denied request for user {requestor_id} to join trip {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Error while submitting rejection for user {requestor_id} from trip {trip_id}"
            }
        )
    