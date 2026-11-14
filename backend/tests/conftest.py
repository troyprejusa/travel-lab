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
