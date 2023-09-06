from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from routers.UserRouter import user_router
from routers.TripRouter import trip_router
from routers.DevRouter import dev_router
from models.WebSocketHandler import socketio_ASGI
from models.DatabaseHandler import db_handler
from models.DatabaseSetup import DatabaseSetup
from utilities import Constants
import jwt
import uvicorn
from utilities import auth_helpers


if Constants.MODE == 'development':
    db_setup = DatabaseSetup(db_handler)
    db_setup.drop_tables()
    db_setup.setup_db()
    db_setup.insert_data()

# Allow external access to the following endpoints:
whitelist = set([
    'docs',
    'openapi.json',
    'dev',
    'sio'
])

# Create app
app = FastAPI()

# Authentication middleware
@app.middleware('http')
async def authenticate_user(request: Request, call_next):
    # print('HTTP Request:', request.url.path)
    root_path = request.url.path.split('/')[1]

    if root_path in whitelist:
        # Bypass JWT verification
        response = await call_next(request)
        return response
    
    else:
        try:
            # Authenticate by verifying JWT before proceeding with path operations
            # Expecting "BEARER <token>"
            auth_header = request.headers['authorization'].split()

            if (auth_header[0].lower() != 'bearer'):
                raise KeyError('No bearer header')
            
            # Decode the JWT and add it to the request state - no exception on decode means we're good to proceed
            decoded_jwt = await auth_helpers.jwt_decode_w_retry(auth_header[1])

            request.state.user = auth_helpers.establish_user_attendance(decoded_jwt[f'{Constants.AUTH0_CLAIM_NAMESPACE}/email'])

            response = await call_next(request)
            
            return response
        
        except jwt.exceptions.InvalidTokenError as token_error:
            # Invalid JWT
            print('authenticate_user: Invalid JWT\n', token_error)
            return JSONResponse(
                status_code=500,
                content= {"message": "Access forbidden"}
            )


# /dev
app.include_router(dev_router)


# /user
app.include_router(user_router)


# /trip
app.include_router(trip_router)


# /socket.io
# Mount ASGI interface-wrapped server
app.mount('/sio', socketio_ASGI)


# Default redirection to handle client-side fwd/back/refresh
@app.get('{full_path:path}')
async def redirect_nav(request: Request, full_path: str):
    print(f'redirect_nav: Requested unkown route:\n{full_path}\nRedirecting to root...')
    return RedirectResponse('/')


# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, error: Exception) -> str:
    # Same behavior as default exception handling, but returns
    # JSON instead of string
    print('general_exception_handler:\n', error)
    return JSONResponse(
        status_code=500,
        content = {
            "message": "Internal server error"
        }
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=Constants.API_PORT)
    