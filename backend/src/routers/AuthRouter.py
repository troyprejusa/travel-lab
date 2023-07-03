from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller
from typing import Annotated
import jwt
from utilities import Constants
import bcrypt

auth_router = APIRouter(
    prefix='/auth'
)

@auth_router.post('/')
async def signin(username: Annotated[str, Form()], password: Annotated[str, Form()]) -> str:
    try:
        auth_q = db_handler.query("""
            SELECT password FROM auth WHERE email=%s;
            """, (username,))
        
        if len(auth_q) != 1:
            raise Exception('INTERNAL: Incorrect username')
        
        auth_data = auth_q[0]

        pwd_check = bcrypt.checkpw(password.encode('utf-8'), auth_data['password'].encode('utf-8'))

        if pwd_check:
            user = db_handler.query("""
                SELECT * FROM traveller WHERE email=%s
                """, (username,))[0]
            
            encoded_jwt = jwt.encode(user, Constants.SECRET, algorithm = Constants.ALGORITHM)

            return JSONResponse(
                status_code = 200,
                content = {
                    "message": "Successful login",
                    "token": encoded_jwt
                }
            )
        
        else:
            raise Exception('INTERNAL: Incorrect password')
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": "Incorrect username or password"
            }
        )
