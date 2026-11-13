import jwt

from utilities import constants
from .auth_service import AuthService
from .models import JwtPayload


class DevAuthService(AuthService):
    """Accept a seeded user's email as a token in development or tests."""

    SEEDED_USERS = frozenset({'troy@test.com', 'joe@test.com'})

    def __init__(self):
        if constants.MODE not in ('development', 'test'):
            raise RuntimeError('DevAuthService requires MODE=development or MODE=test')

    async def jwt_decode_w_retry(self, token: str) -> JwtPayload:
        return self.decode_jwt(token, None)

    async def get_rsa_keys(self, token: str) -> dict:
        raise NotImplementedError('Development authentication does not use signing keys')

    def decode_jwt(self, token: str, rsa_key) -> JwtPayload:
        if token not in self.SEEDED_USERS:
            raise jwt.InvalidTokenError('Unknown development user')
        return JwtPayload(sub=f'dev|{token}', email=token)
