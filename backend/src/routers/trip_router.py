from fastapi import APIRouter

trip_router = APIRouter(
    prefix='/trip'
)

@trip_router.get('/{tripid}')
async def stuff(tripid: int):
    return {
        'tripid': tripid
    }
