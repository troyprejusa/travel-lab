import jwt

from utilities import constants
from models.database_seed import JOE_EMAIL, TROY_EMAIL
from .auth_service import AuthSettings, AuthService
from .models import JwtPayload


class DevelopmentAuthConfig(AuthSettings):
    """Development authentication requires no provider credentials."""



class DevAuthService(AuthService):
    """Accept a seeded user's email as a token in development or tests."""

    SEEDED_USERS = frozenset({TROY_EMAIL, JOE_EMAIL})

    def __init__(self):
        if constants.MODE == constants.Mode.PRODUCTION:
            raise RuntimeError('DevAuthService requires MODE=development or MODE=test')

    async def delete_user(self, provider_user_id: str) -> None:
        # Seeded development identities have no external account to delete.
        return None

    async def jwt_decode_w_retry(self, token: str) -> JwtPayload:
        return self.decode_jwt(token, None)

    async def get_rsa_keys(self, token: str) -> dict:
        raise NotImplementedError('Development authentication does not use signing keys')

    def decode_jwt(self, token: str, rsa_key) -> JwtPayload:
        if token not in self.SEEDED_USERS:
            raise jwt.InvalidTokenError('Unknown development user')
        return JwtPayload(sub=f'dev|{token}', email=token)
