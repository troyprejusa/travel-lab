from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from pydantic import BaseModel

auth_router = APIRouter(
    prefix='/auth'
)

class AuthBody(BaseModel):
    username: str
    password: str

@auth_router.get('/')
async def authenticate_user(body: AuthBody) -> str:
    pass
