from fastapi import APIRouter

user_router = APIRouter(
    prefix='/user'
)

@user_router.get('/{userid}')
async def stuff(userid: int):
    return {
        'userid': userid
    }
