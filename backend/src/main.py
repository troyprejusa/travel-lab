from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from routers.UserRouter import user_router
from routers.TripRouter import trip_router
from routers.AuthRouter import auth_router
from routers.DevRouter import dev_router
from models.WebSocketHandler import socketio_ASGI
from models.DatabaseHandler import db_handler
from models.DatabaseSetup import DatabaseSetup
from utilities import Constants
import jwt
import uvicorn

# DB SETUP DEV ONLY
db_setup = DatabaseSetup(db_handler)
db_setup.drop_tables()
db_setup.setup_db()
db_setup.insert_data()

# Allow external access to the following endpoints:
whitelist = set([
    'docs',
    'openapi.json',
    'auth',
    'dev',
    'sio'
])

# Create app
app = FastAPI()

@app.middleware('http')
async def verify_auth(request: Request, call_next):
    print('HTTP Request:', request.url.path)
    root_path = request.url.path.split('/')[1]

    if root_path in whitelist:
        response = await call_next(request)
        return response
    else:
        # Verify JWT before proceeding with path operations
        try:
            encoded_jwt = request.headers['authorization'].split(' ')[1]

            # Decode the JWT and add it to the request state - no exception on decode means we're good to proceed
            decoded_jwt = jwt.decode(encoded_jwt, Constants.SECRET, algorithms=Constants.ALGORITHM)
            request.state.user = decoded_jwt

            response = await call_next(request)
            
            return response
        
        except KeyError as ke:
            # No authorization token
            print('INTERNAL: No authorization header')
            return JSONResponse(
                status_code=500,
                content= {"message": "Access forbidden"}
            )
        except jwt.InvalidSignatureError as se:
            # Invalid JWT
            print('INTERNAL: Invalid JWT Signature')
            return JSONResponse(
                status_code=500,
                content= {"message": "Access forbidden"}
            )


# /dev
app.include_router(dev_router)


# /auth
app.include_router(auth_router)


# /user
app.include_router(user_router)


# /trip
app.include_router(trip_router)


# /socket.io
# Mount ASGI interface-wrapped server
app.mount('/sio', socketio_ASGI)


# Default redirection to handle client-side fwd/back/refresh
@app.get('{full_path:path}')
async def redirect_nav(request: Request, full_path:str):
    print(f'Requested unkown route:\n{full_path}\nRedirecting to root...')
    return RedirectResponse('/')


# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, e: Exception) -> str:
    # Same behavior as default exception handling, but returns
    # JSON instead of string
    print(str(e))
    return JSONResponse(
        status_code=500,
        content = {
            "message": "Internal server error"
        }
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=Constants.API_PORT)
    