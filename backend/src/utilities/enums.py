from enum import Enum


class Mode(str, Enum):
    DEVELOPMENT = 'development'
    TEST = 'test'
    PRODUCTION = 'production'


class AuthProvider(str, Enum):
    DEVELOPMENT = 'development'
    CLERK = 'clerk'
    AUTH0 = 'auth0'
