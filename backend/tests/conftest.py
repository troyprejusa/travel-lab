import os
import sys

import pytest
import pytest_asyncio
from testcontainers.community.postgres import PostgresContainer

if sys.platform == 'darwin':
    os.environ.setdefault('TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE', '/var/run/docker.sock')

from models.database_handler import PsycopgDatabaseHandler
from models.sqlalchemy_database_handler import SQLAlchemyDatabaseHandler
from models.database_setup import DatabaseSetup


@pytest.fixture(scope='session')
def postgres():
    with PostgresContainer('postgres:18', username='test', password='test', dbname='test', driver=None) as container:
        yield container


@pytest_asyncio.fixture(params=[PsycopgDatabaseHandler, SQLAlchemyDatabaseHandler], ids=['psycopg', 'sqlalchemy'])
async def db(postgres, request):
    handler = request.param(
        host=postgres.get_container_host_ip(),
        port=postgres.get_exposed_port(5432),
        user='test', password='test', database='test',
    )
    await handler.open()
    setup = DatabaseSetup(handler)
    try:
        await setup.drop_tables()
        await setup.setup_db()
        yield handler
    finally:
        await handler.close()


@pytest_asyncio.fixture
async def api(db, monkeypatch):
    """Run the ASGI application against the isolated PostgreSQL instance."""
    import httpx
    from auth.dev_auth_service import DevAuthService
    from main import app
    from routers import trip_router, user_router
    from utilities import auth_helpers, middleware

    for module in (trip_router, user_router, auth_helpers):
        monkeypatch.setattr(module, 'db_handler', db)
    monkeypatch.setattr(middleware, 'auth_service', DevAuthService())
    middleware.rest_rate_tracker.tracker.clear()
    await db.create_user('troy@test.com')
    await db.create_user('joe@test.com')
    from itertools import count
    request_ids = count()

    async def distinct_client(request):
        request.headers['x-forwarded-for'] = f'test-client-{next(request_ids)}'

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test', event_hooks={'request': [distinct_client]}) as client:
        yield client


@pytest.fixture
def owner_headers():
    return {'Authorization': 'Bearer troy@test.com'}


@pytest.fixture
def guest_headers():
    return {'Authorization': 'Bearer joe@test.com'}
