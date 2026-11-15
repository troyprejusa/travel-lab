from enum import Enum


class Mode(str, Enum):
    DEVELOPMENT = 'development'
    TEST = 'test'
    PRODUCTION = 'production'
