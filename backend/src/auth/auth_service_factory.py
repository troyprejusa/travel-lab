from utilities import constants

from .auth0_service import Auth0Service
from .auth_service import AuthService
from .dev_auth_service import DevAuthService


def create_auth_service() -> AuthService:
    if constants.MODE in ('development', 'test'):
        return DevAuthService()
    return Auth0Service()
