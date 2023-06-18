from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Trip


trip_router = APIRouter(
    prefix='/trip'
)

@trip_router.get('/{tripid}')
async def stuff(tripid: int):
    return {
        'tripid': tripid
    }
