from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from typing import Annotated
from models.DatabaseHandler import db_handler


dev_router = APIRouter()

@dev_router.get("/")
async def hello_world() -> dict[str, str]:
    return JSONResponse(
        status_code=200,
        content= {"message": "Hello World"}
    )

@dev_router.post('/alpha')
async def verify_alpha(email: Annotated[str, Form()], key: Annotated[str, Form()]) -> str:
    if await db_handler.check_alpha_key(email, key):
        return JSONResponse(status_code=200, content={'message': 'Alpha key OK'})
    else:
        return JSONResponse(status_code=403, content={'message': 'Invalid alpha key'})
