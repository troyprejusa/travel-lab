from fastapi import FastAPI
from routers.project import project_router
from models.db_connect import cursor

try:
    cursor.execute("CREATE TABLE IF NOT EXISTS python;")
    cursor.commit()
except Exception:
    print(str(Exception))
    print('Unable to create table')

app = FastAPI()

app.include_router(project_router)

@app.get("/")
async def root() -> dict:
    return {"message": "Hello World"}