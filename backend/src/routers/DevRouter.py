from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller


dev_router = APIRouter(
    prefix='/dev'
)

@dev_router.get("/helloworld")
async def root() -> dict[str, str]:
    return JSONResponse(
        status_code=200,
        content= {"message": "Hello World"}
    )

