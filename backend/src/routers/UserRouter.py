from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import UserModel, TripModel
from utilities.auth_helpers import verify_attendance, verify_admin


user_router = APIRouter(
    prefix='/user'
)

# Upsert a user in database
@user_router.post('/{email}')
async def upsert_user(email: str) -> UserModel | str:
    try:
        user = db_handler.upsert_user(email)
        return user
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to upsert user {email}"
            }
        )

# Delete current user from database
@user_router.delete('/')
async def delete_user(request: Request) -> str:
    try:
        db_handler.delete_user(request.state.user['email'])

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

# Get current user's trips
@user_router.get('/trips')
async def get_trips(request: Request) -> list[TripModel] | str:
    try:
        data = db_handler.get_trips(request.state.user['email'])
        return data
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to get trips for {request.state.user['email']}"
            }
        )

# Current user leaves a trip
@user_router.delete('/trips/{trip_id}')
async def leave_trip(request: Request, trip_id: str) -> str:
    try:
        verify_attendance(trip_id, request.state.user['trips'])

        db_handler.leave_trip(request.state.user['email'], trip_id)
        
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
    

# Current user requests to join trip
@user_router.post('/trips/{trip_id}')
async def request_join_trip(request: Request, trip_id: str) -> str:
    try:
        db_handler.request_trip(request.state.user['email'], trip_id)
        
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
    
# Trip admin accepts request to join trip
@user_router.patch('/trips/{trip_id}/{traveller_id}')
async def accept_join_trip(request: Request, trip_id: str, traveller_id: str) -> str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.accept_request(traveller_id, trip_id)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: Accepted user {traveller_id} into trip {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable accept user {traveller_id} for trip {trip_id}"
            }
        )

# Trip admin removes (possibly pending) user from trip
@user_router.delete('/trips/{trip_id}/{traveller_id}')
async def remove_from_trip(request: Request, trip_id: str, traveller_id: str) -> str:
    try:
        verify_admin(trip_id, request.state.user['trips'])

        db_handler.remove_traveller(traveller_id, trip_id)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"SUCCESS: User {traveller_id} no longer a part of trip {trip_id}"
            }
        )
    
    except Exception as error:
        print(error)
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Error while submitting rejection for user {traveller_id} from trip {trip_id}"
            }
        )
