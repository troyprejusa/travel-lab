from fastapi import APIRouter
from fastapi.responses import JSONResponse


dev_router = APIRouter(
    prefix='/dev'
)

@dev_router.get("/")
async def root() -> dict[str, str]:
    return JSONResponse(
        status_code=200,
        content= {"message": "Hello World"}
    )

