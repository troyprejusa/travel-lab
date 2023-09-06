from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller, Trip
from typing import Annotated
from utilities import auth_helpers
import bcrypt


user_router = APIRouter(
    prefix='/user'
)

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
                "message": "ERROR: Unable to upsert user"
            }
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
async def get_trips(request: Request) -> list[Trip] | dict[str, str]:
    try:
        data = db_handler.query("""
            SELECT * FROM trip
                WHERE id IN 
                (SELECT trip_id FROM traveller_trip WHERE traveller_id = (SELECT id from traveller where email=%s) AND confirmed = True);
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
