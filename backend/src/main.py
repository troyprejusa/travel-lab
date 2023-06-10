from fastapi import FastAPI
from routers.user_router import user_router
from routers.trip_router import trip_router
from models.db_handler import db_handler


app = FastAPI()

@app.get("/helloworld")
async def root() -> dict:
    return {"message": "Hello World"}

# /user
app.include_router(user_router)

# /trip
app.include_router(trip_router)
