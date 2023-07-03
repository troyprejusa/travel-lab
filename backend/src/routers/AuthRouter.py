from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller
from typing import Annotated
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
SECRET = os.getenv('SECRET')
ALGORITHM = os.getenv('ALGORITHM')

auth_router = APIRouter(
    prefix='/auth'
)

@auth_router.post('/')
async def authenticate_user(username: Annotated[str, Form()], password: Annotated[str, Form()]) -> str:
    try:
        count = db_handler.query("""
            SELECT COUNT(email) FROM auth WHERE email=%s AND password=%s;
            """, (username, password))[0]['count']
        
        if count != 1:
            raise Exception('Incorrect username or password')
        
        user = db_handler.query("""
            SELECT * FROM traveller WHERE email=%s
            """, (username,))[0]
        
        encoded_jwt = jwt.encode(user, SECRET, algorithm = ALGORITHM)

        return JSONResponse(
            status_code = 200,
            content = {
                "message": "Successful login",
                "token": encoded_jwt
            }
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": "Incorrect username or password"
            }
        )
