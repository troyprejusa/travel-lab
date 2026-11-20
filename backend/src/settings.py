"""Typed, validated backend environment settings."""
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from auth.auth_service import AuthSettings
from utilities.enums import AuthProvider, Mode


class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=False)

    mode: Mode
    host: str = Field(min_length=1)

    api_request_count: int = Field(gt=0)
    api_requests_window: int = Field(gt=0)
    ws_request_count: int = Field(gt=0)
    ws_request_window: int = Field(gt=0)

    db_host: str = Field(min_length=1)
    db_port: int = Field(gt=0, le=65535)
    db_user: str = Field(min_length=1)
    db_pwd: SecretStr
    db_dbname: str = Field(min_length=1)
    db_conn_limit: int = Field(gt=0)

    limit_total_users: int = Field(gt=0)
    limit_trips_created_per_user: int = Field(gt=0)
    limit_trips_attended_per_user: int = Field(gt=0)
    limit_travellers_per_trip: int = Field(gt=0)
    limit_itinerary_per_trip: int = Field(gt=0)
    limit_polls_per_trip: int = Field(gt=0)
    limit_packing_per_trip: int = Field(gt=0)
    limit_messages_per_trip: int = Field(gt=0)

    auth_provider: AuthProvider
    auth_config: AuthSettings
