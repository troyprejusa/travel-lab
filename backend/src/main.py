from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from routers.UserRouter import user_router
from routers.TripRouter import trip_router
from routers.DevRouter import dev_router
from models.WebSocketHandler import socketio_ASGI
from models.DatabaseHandler import db_handler
from models.DatabaseSetup import DatabaseSetup
from utilities import middleware
from utilities import Constants


if Constants.MODE == 'development':
    db_setup = DatabaseSetup(db_handler)
    db_setup.drop_tables()
    db_setup.setup_db()
    db_setup.insert_data()

# Create app
app = FastAPI()

# Add middleware - non-decorator syntax
# NOTE: FastAPI executes middleware in the REVERSE order they are declared, like an onion
app.middleware('http')(middleware.authenticate_user)    # (3) Authenticate user
app.middleware('http')(middleware.serve_static_files)   # (2) Serve public content
app.middleware('http')(middleware.rate_limiter)         # (1) Rate limit

# /assets
app.mount('/assets', StaticFiles(directory='/app/src/dist/assets'), name='assets')

# /dev
app.include_router(dev_router)

# /user
app.include_router(user_router)

# /trip
app.include_router(trip_router)

# socket.io - Mount ASGI interface-wrapped server
app.mount('/sio', socketio_ASGI)

# Default redirection to handle client-side fwd/back/refresh
@app.get('{full_path:path}')
async def redirect_nav(_request: Request, full_path: str):
    print(f'redirect_nav: Requested unkown route:\n{full_path}\nRedirecting to root...')
    return RedirectResponse('/')

# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(_request: Request, exception: Exception) -> str:
    if isinstance(exception, (RequestValidationError, StarletteHTTPException)):
        # Note: FastAPI HTTPException inherits from Starlette's so this catches both
        # Re-raise the exception so that FastAPI's default exceptions handlers
        # can perform as normal
        raise exception
    
    print(str(exception))

    # Same behavior as default exception handling, but returns
    # JSON instead of string
    return JSONResponse(
        status_code=500,
        content = {
            "message": "Internal server error"
        }
    )
    