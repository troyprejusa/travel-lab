from utilities import environment

from .auth0_service import Auth0Service
from .clerk_service import ClerkService
from .auth_service import AuthService
from .dev_auth_service import DevAuthService


def create_auth_service() -> AuthService:
    if environment.AUTH_PROVIDER == environment.AuthProvider.DEVELOPMENT:
        return DevAuthService()
    if environment.AUTH_PROVIDER == environment.AuthProvider.CLERK:
        return ClerkService()
    if environment.AUTH_PROVIDER == environment.AuthProvider.AUTH0:
        return Auth0Service()
    raise RuntimeError('Invalid AUTH_PROVIDER for this environment')
