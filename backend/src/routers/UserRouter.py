from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip


user_router = APIRouter(
    prefix='/user'
)

# Delete account
@user_router.delete('/')
async def delete_user(request: Request) -> str:
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
            SELECT * FROM trip
                WHERE id IN 
                (SELECT trip_id FROM traveller_trip WHERE traveller_id = %s) 
        """, (request.state.user['id'],))
        
        return data
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"ERROR: Unable to find user {request.state.user['id']}"
            }
        )
    
# Join a trip
@user_router.post('/trips')
async def join_trip(request: Request, trip: Trip) -> str:    
    pass

# Leave a trip
@user_router.delete('/trips')
async def leave_trip(request: Request, trip: Trip) -> str:
    pass

