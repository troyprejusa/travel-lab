from fastapi import FastAPI
from routers.project import project_router
# from models.db_connect import cursor

app = FastAPI()

app.include_router(project_router)

@app.get("/")
async def root() -> dict:
    return {"message": "Hello World"}