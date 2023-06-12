from fastapi import APIRouter
from models.DatabaseHandler import db_handler
from models.Schemas import Traveller

dev_router = APIRouter(
    prefix='/dev'
)

@dev_router.get('/')
async def test_user(email: str) -> Traveller:
    try:
        data = db_handler.query("""
            SELECT * FROM traveller WHERE email = %s;
        """, (email,))
        return data[0]
    except:
        raise Exception("Unable to retreive test user")
