from models.database_seed import JOE_EMAIL, TROY_EMAIL
import os
import sys

import pytest
import pytest_asyncio
from testcontainers.community.postgres import PostgresContainer

if sys.platform == 'darwin':
    os.environ.setdefault('TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE', '/var/run/docker.sock')

from models.database_handler import PsycopgDatabaseHandler  # noqa: E402
from models.sqlalchemy_database_handler import SQLAlchemyDatabaseHandler  # noqa: E402
from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402


@pytest.fixture(scope='session')
def postgres():
    with PostgresContainer('postgres:18', username='test', password='test', dbname='test', driver=None) as container:
        yield container


@pytest_asyncio.fixture(params=[PsycopgDatabaseHandler, SQLAlchemyDatabaseHandler], ids=['psycopg', 'sqlalchemy'])
async def db(postgres, request, pytestconfig):
    handler = request.param(
        host=postgres.get_container_host_ip(),
        port=postgres.get_exposed_port(5432),
        user='test', password='test', database='test',
    )
    await handler.open()
    config = Config(str(pytestconfig.rootpath / 'alembic.ini'))
    engine = create_engine(postgres.get_connection_url().replace('postgresql://', 'postgresql+psycopg://'))
    try:
        with engine.begin() as connection:
            config.attributes['connection'] = connection
            command.downgrade(config, 'base')
            command.upgrade(config, 'head')
        yield handler
    finally:
        engine.dispose()
        await handler.close()


@pytest_asyncio.fixture
async def api(db, monkeypatch):
    """Run the ASGI application against the isolated PostgreSQL instance."""
    import httpx
    from main import app
    from routers import trip_router, user_router
    from utilities import auth_helpers, middleware

    for module in (trip_router, user_router, auth_helpers):
        monkeypatch.setattr(module, 'db_handler', db)
    middleware.rest_rate_tracker.tracker.clear()
    await db.create_user(TROY_EMAIL)
    await db.create_user(JOE_EMAIL)
    from itertools import count
    request_ids = count()

    async def distinct_client(request):
        request.headers['x-forwarded-for'] = f'test-client-{next(request_ids)}'

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test', event_hooks={'request': [distinct_client]}) as client:
        yield client


@pytest.fixture
def owner_headers():
    return {'Authorization': f'Bearer {TROY_EMAIL}'}


@pytest.fixture
def guest_headers():
    return {'Authorization': f'Bearer {JOE_EMAIL}'}
