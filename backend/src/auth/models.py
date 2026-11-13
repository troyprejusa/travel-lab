from pydantic import BaseModel, ConfigDict, Field


class JwtPayload(BaseModel):
    """Verified identity claims consumed by the application."""

    model_config = ConfigDict(extra='allow')

    sub: str = Field(strict=True, min_length=1)
    email: str = Field(strict=True, min_length=1)
