from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers.UserRouter import user_router
from routers.TripRouter import trip_router
from routers.DevRouter import dev_router
from models.DatabaseHandler import db_handler
from models.DatabaseSetup import DatabaseSetup
import uvicorn

# DB SETUP DEV ONLY
db_setup = DatabaseSetup(db_handler)
db_setup.drop_tables()
db_setup.setup_db()
DatabaseSetup.insert_data(db_handler)

# Create app
app = FastAPI()

# Handle CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''     DEV ONLY        '''
# DEV ONLY (START) ###
@app.get("/helloworld")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}
app.include_router(dev_router)
'''     DEV ONLY        '''

# /user
app.include_router(user_router)

# /trip
app.include_router(trip_router)

# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, e: Exception):
    # Same behavior as default exception handling, but returns
    # JSON instead of string
    return JSONResponse(
        status_code=500,
        content = {
            "message": "Internal server error"
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)