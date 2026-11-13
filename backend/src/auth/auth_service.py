from abc import ABC, abstractmethod


class AuthService(ABC):
    @abstractmethod
    async def jwt_decode_w_retry(self, token: str) -> dict:
        ...

    @abstractmethod
    async def get_rsa_keys(self, token: str) -> dict:
        ...

    @abstractmethod
    def decode_jwt(self, token: str, rsa_key) -> dict:
        ...
