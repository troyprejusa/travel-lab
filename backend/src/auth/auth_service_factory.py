from settings import Settings
from utilities.enums import AuthProvider

from .auth0_service import Auth0Service, Auth0Settings
from .clerk_service import ClerkService, ClerkSettings
from .auth_service import AuthService, AuthSettings
from .dev_auth_service import DevAuthService, DevelopmentAuthConfig


def build_auth_config(provider: AuthProvider) -> AuthSettings:
    if provider == AuthProvider.DEVELOPMENT:
        return DevelopmentAuthConfig()
    if provider == AuthProvider.CLERK:
        return ClerkSettings()
    if provider == AuthProvider.AUTH0:
        return Auth0Settings()
    raise ValueError(f'Unsupported authentication provider: {provider}')


def create_auth_service(config: Settings) -> AuthService:
    if config.auth_provider == AuthProvider.DEVELOPMENT and isinstance(config.auth_config, DevelopmentAuthConfig):
        return DevAuthService(config.mode)
    if config.auth_provider == AuthProvider.CLERK and isinstance(config.auth_config, ClerkSettings):
        return ClerkService(config.auth_config)
    if config.auth_provider == AuthProvider.AUTH0 and isinstance(config.auth_config, Auth0Settings):
        return Auth0Service(config.auth_config)
    raise ValueError('Authentication provider and settings do not match')
