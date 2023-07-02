from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller
from typing import Annotated

auth_router = APIRouter(
    prefix='/auth'
)

@auth_router.post('/')
async def authenticate_user(username: Annotated[str, Form()], password: Annotated[str, Form()]) -> Traveller | str:
    try:
        count = db_handler.query("""
            SELECT email FROM auth WHERE email=%s AND password=%s;
            """, (username, password))
        if count != 1:
            raise Exception('Incorrect username or password')
        
        user = db_handler.query("""
            AJDF;LJAS;DLFJ
        """)
        
        # TODO: RETURN A JWT TO AUTHORIZE RETRIEVING A USER'S DATA!
        # A frontend must not be able to ask for a user directly via any request

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": "Incorrect username or password"
            }
        )
