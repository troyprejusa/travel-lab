from fastapi import FastAPI
from routers.trip_router import trip_router
from models.db_handler import db_handler


app = FastAPI()


@app.get("/")
async def root() -> dict:
    return {"message": "Hello World"}

# /trip
app.include_router(trip_router)