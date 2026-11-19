from abc import ABC, abstractmethod
from .models import JwtPayload


class AuthService(ABC):
    @abstractmethod
    async def delete_user(self, provider_user_id: str) -> None:
        """Delete the authenticated user from the identity provider."""
        ...

    @abstractmethod
    async def jwt_decode_w_retry(self, token: str) -> JwtPayload:
        ...

    @abstractmethod
    async def get_rsa_keys(self, token: str) -> dict:
        ...

    @abstractmethod
    def decode_jwt(self, token: str, rsa_key) -> JwtPayload:
        ...
