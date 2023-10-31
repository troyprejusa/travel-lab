from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, FileResponse
from routers.UserRouter import user_router
from routers.TripRouter import trip_router
from routers.DevRouter import dev_router
from models.WebSocketHandler import socketio_ASGI
from models.DatabaseHandler import db_handler
from models.DatabaseSetup import DatabaseSetup
from utilities import middleware
from utilities import Constants
import uvicorn


if Constants.MODE == 'development':
    db_setup = DatabaseSetup(db_handler)
    db_setup.drop_tables()
    db_setup.setup_db()
    db_setup.insert_data()

# Create app
app = FastAPI()


# Add middleware - non-decorator syntax
app.middleware('http')(middleware.rate_limiter)
app.middleware('http')(middleware.authenticate_user)

@app.get('/')
async def serve_page() -> FileResponse:
    return FileResponse("/app/dist/index.html")

app.mount('/assets', StaticFiles(directory='/app/dist/assets'), name='assets')

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
async def redirect_nav(request: Request, full_path: str):
    print(f'redirect_nav: Requested unkown route:\n{full_path}\nRedirecting to root...')
    return RedirectResponse('/')


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=Constants.API_PORT)
    