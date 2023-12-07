from fastapi import APIRouter
from .UserRouter import user_router
from .TripRouter import trip_router


api_router = APIRouter()

# /user
api_router.include_router(user_router, prefix='/user')

# /trip
api_router.include_router(trip_router, prefix='/trip')
