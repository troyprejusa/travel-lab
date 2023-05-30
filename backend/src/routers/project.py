from fastapi import APIRouter

project_router = APIRouter(
    prefix='/project'
)

@project_router.get('/{projectid}')
async def stuff(projectid: int):
    return {
        'projectid': projectid
    }
