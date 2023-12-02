from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from routers.DevRouter import dev_router
from routers.ApiRouterV1 import api_router
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

# Unauthenticated endpoints for dev/alpha
app.include_router(dev_router, prefix='/dev')

# REST API endpoints
app.include_router(api_router, prefix='/api/v1')

# socket.io - Mount ASGI interface-wrapped server
app.mount('/sio', socketio_ASGI)

# Default redirection to handle client-side fwd/back/refresh
@app.get('{full_path:path}')
async def redirect_nav(_request: Request, full_path: str):
    # NOTE: Sending FileResponse allows the app to handle the refresh correctly.
    # Sending RedirectResponse('/') does send return to root, but doesn't autonavigate after
    # print(f'redirect_nav: Requested unkown route:\n{full_path}\nSending index.html...')
    return FileResponse('/app/src/dist/index.html')

# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(_request: Request, exception: Exception) -> str:
    if isinstance(exception, (RequestValidationError, StarletteHTTPException)):
        # Note: FastAPI HTTPException inherits from Starlette's so this catches both
        # Re-raise the exception so that FastAPI's default exceptions handlers
        # can perform as normal
        raise exception
    
    print(f'GLOBAL_EXCEPTION_HANDLER: {type(exception).__name__}\n\t{exception}')

    # Same behavior as default exception handling, but returns
    # JSON instead of string
    return JSONResponse(
        status_code=500,
        content = {
            "message": "Internal server error"
        }
    )
    