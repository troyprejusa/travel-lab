from fastapi import FastAPI
from routers.project import project_router
from models.db_setup import db_handler


app = FastAPI()

app.include_router(project_router)

@app.get("/")
async def root() -> dict:
    return {"message": "Hello World"}