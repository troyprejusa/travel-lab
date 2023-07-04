from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller
from typing import Annotated
import jwt
from utilities import Constants
import bcrypt

'''
/auth

Operations:
    Sign in
    Create User
'''
auth_router = APIRouter(
    prefix='/auth'
)

@auth_router.post('/signin')
async def sign_in(username: Annotated[str, Form()], password: Annotated[str, Form()]) -> str:
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

@auth_router.post('/createuser')
async def create_user(
    first_name: Annotated[str, Form()], 
    last_name: Annotated[str, Form()], 
    email: Annotated[str, Form()], 
    phone: Annotated[str, Form()],
    password: Annotated[str, Form()]
    ) -> str:
    try:
        # Hash the password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        ascii_hashed = hashed.decode('ascii')

        db_handler.query("""
            INSERT INTO traveller 
            (first_name, last_name, email, phone)
            VALUES (%s, %s, %s, %s);

            INSERT INTO auth VALUES (%s, %s);
        """, (first_name, last_name, email, phone, email, ascii_hashed))

        return JSONResponse(
            status_code=200,
            content = {
                "message": "Success"
            }
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content = {
                "message": "Unable to create user"
            }
        )
