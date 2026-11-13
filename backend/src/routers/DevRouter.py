from fastapi import APIRouter
from fastapi.responses import JSONResponse


dev_router = APIRouter()

@dev_router.get("/")
async def hello_world() -> dict[str, str]:
    return JSONResponse(
        status_code=200,
        content= {"message": "Hello World"}
    )
