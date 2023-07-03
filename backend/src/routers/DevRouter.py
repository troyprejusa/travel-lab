from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller

dev_router = APIRouter(
    prefix='/dev'
)

@dev_router.get("/helloworld")
async def root() -> dict[str, str]:
    return JSONResponse(
        status_code=200,
        content= {"message": "Hello World"}
    )

@dev_router.get('/')
async def test_user(email: str) -> Traveller:
    try:
        data = db_handler.query("""
            SELECT * FROM traveller WHERE email = %s;
        """, (email,))

        return data[0]
    
    except:
        return JSONResponse(
            status_code=500,
            content = {
                "message": f"DEV | ERROR: Unable to login test user"
            }
        )
