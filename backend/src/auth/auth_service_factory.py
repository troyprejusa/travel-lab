from utilities import constants

from .auth0_service import Auth0Service
from .clerk_service import ClerkService
from .auth_service import AuthService
from .dev_auth_service import DevAuthService


def create_auth_service() -> AuthService:
    if constants.AUTH_PROVIDER == constants.AuthProvider.DEVELOPMENT:
        return DevAuthService()
    if constants.AUTH_PROVIDER == constants.AuthProvider.CLERK:
        return ClerkService()
    if constants.AUTH_PROVIDER == constants.AuthProvider.AUTH0:
        return Auth0Service()
    raise RuntimeError('Invalid AUTH_PROVIDER for this environment')
