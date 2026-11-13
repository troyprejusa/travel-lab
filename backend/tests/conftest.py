import os
import sys
from pathlib import Path

import pytest
import pytest_asyncio
from testcontainers.community.postgres import PostgresContainer

if sys.platform == 'darwin':
    os.environ.setdefault('TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE', '/var/run/docker.sock')

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src'))

from models.database_handler import PsycopgDatabaseHandler  # noqa: E402
from models.database_setup import DatabaseSetup  # noqa: E402


@pytest.fixture(scope='session')
def postgres():
    with PostgresContainer('postgres:18', username='test', password='test', dbname='test', driver=None) as container:
        yield container


@pytest_asyncio.fixture
async def db(postgres):
    handler = PsycopgDatabaseHandler(
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
