from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated
from models.DatabaseHandler import db_handler
from models.Schemas import UserModel, TripModel
from utilities.auth_helpers import verify_attendance, verify_admin, get_auth0_manager
from utilities import Constants
from .RoutersLogger import router_logger


user_router = APIRouter()

'''
# Upsert a user in database

Because Auth0 can have data for a user that we may or may 
not have added to our database yet, perform an upsert and 
return whatever data is there for this user
'''
@user_router.post('/{email}')
async def upsert_user(email: str) -> UserModel | str:
    try:
        user = db_handler.get_user(email)
        if not user:
            if db_handler.count_users() >= Constants.LIMIT_TOTAL_USERS:
                return JSONResponse(
                    status_code=422,
                    content={
                        "detail": {
                            "message": "No more users allowed at this time."
                        }
                    }
                )
            user = db_handler.create_user(email)

        return user
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable to upsert user {email}"
            }
        )

# Update a user's first name, last name, and phone
@user_router.patch('/{email}')
async def patch_user_info(
        email: str,
        first_name: Annotated[str, Form()],
        last_name: Annotated[str, Form()],
        phone: Annotated[str, Form()],
    ) -> UserModel | str:
    try:
        updated_user = db_handler.patch_user_info(first_name, last_name, phone, email)

        return updated_user
      
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable to update user info {email}"
            }
        )
    
# Delete current user from database
@user_router.delete('/{email}')
async def delete_user(request: Request, email: str) -> str:
    try:
        auth0 = get_auth0_manager()
        auth0.users.delete(request.state.user['auth0_id'])
        db_handler.delete_user(email)

        return JSONResponse(
            status_code=200,
            content={
                "message": f"Deleted user {email}"
            }
        )
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable to delete user {email}"
            }
        )
    
@user_router.get('/{email}/alpha')
async def get_alpha_key(email: str) -> str:
    try:
        keyDict = db_handler.get_alpha_key(email)
        return keyDict['key']
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable to get alpha key"
            }
        )

# Get current user's trips
@user_router.get('/trips')
async def get_trips(request: Request) -> list[TripModel] | str:
    try:
        data = db_handler.get_trips(request.state.user['email'])
        return data
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable to get trips for {request.state.user['email']}"
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
                "message": f"Removed user {request.state.user['email']} from trip {trip_id}"
            }
        )
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable to remove user {request.state.user['email']} from trip {trip_id}"
            }
        )
    

# Current user requests to join trip
@user_router.post('/trips/{trip_id}')
async def request_join_trip(request: Request, trip_id: str) -> str:
    try:
        if db_handler.count_user_trips_attended(request.state.user['email']) >= Constants.LIMIT_TRIPS_ATTENDED_PER_USER:
            return JSONResponse(
                status_code=422,
                content={
                    "detail": {
                        "message": f"User {request.state.user['email']} has reached limit for number of attended trips. Leave an existing trip before joining another one."
                    }
                }
            )
        
        if db_handler.count_travellers_on_trip(trip_id) >= Constants.LIMIT_TRAVELLERS_PER_TRIP:
            return JSONResponse(
                status_code=422,
                content={
                    "detail": {
                        "message": f"Trip {trip_id} has reached limit for for the number of travellers. Other travellers must leave before you can join."
                    }
                }
            )
        
        db_handler.request_trip(request.state.user['email'], trip_id)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Submitted request for user {request.state.user['email']} to join {trip_id}"
            }
        )
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable for user {request.state.user['email']} to request joining trip {trip_id}"
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
                "message": f"Accepted user {traveller_id} into trip {trip_id}"
            }
        )
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Unable accept user {traveller_id} for trip {trip_id}"
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
                "message": f"User {traveller_id} no longer a part of trip {trip_id}"
            }
        )
    
    except Exception as error:
        router_logger.error(error)
        raise HTTPException(
            status_code=500,
            detail={
                "message": f"Error while submitting rejection for user {traveller_id} from trip {trip_id}"
            }
        )
