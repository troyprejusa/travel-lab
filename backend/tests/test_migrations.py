import os
import subprocess
import sys

import psycopg
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine


def test_migrations_and_seed(postgres, pytestconfig):
    root = pytestconfig.rootpath
    engine = create_engine(postgres.get_connection_url().replace('postgresql://', 'postgresql+psycopg://'))
    config = Config(str(root / 'alembic.ini'))
    with engine.begin() as connection:
        config.attributes['connection'] = connection
        command.downgrade(config, 'base')
        command.upgrade(config, '002_travellers_and_trips')
        assert connection.exec_driver_sql("SELECT to_regclass('trip')").scalar_one() == 'trip'
        assert connection.exec_driver_sql("SELECT to_regclass('poll')").scalar_one() is None
        command.upgrade(config, 'head')
        command.upgrade(config, 'head')
    env = os.environ | {
        'MODE': 'test', 'DB_HOST': postgres.get_container_host_ip(),
        'DB_PORT': str(postgres.get_exposed_port(5432)),
        'DB_USER': 'test', 'DB_PWD': 'test', 'DB_DBNAME': 'test',
    }
    subprocess.run([sys.executable, str(root / 'src/db_seed.py')], env=env, check=True)
    with psycopg.connect(host=env['DB_HOST'], port=env['DB_PORT'], user='test', password='test', dbname='test') as connection:
        assert connection.execute('SELECT count(*) FROM traveller').fetchone()[0] == 2
        assert connection.execute("SELECT nextval(pg_get_serial_sequence('poll', 'id'))").fetchone()[0] > 102
        assert connection.execute("SELECT nextval(pg_get_serial_sequence('poll_option', 'id'))").fetchone()[0] > 205
        assert connection.execute("SELECT nextval(pg_get_serial_sequence('poll_vote', 'id'))").fetchone()[0] > 301
    with engine.begin() as connection:
        config.attributes['connection'] = connection
        command.downgrade(config, 'base')
        command.upgrade(config, 'head')
        assert connection.exec_driver_sql('SELECT count(*) FROM traveller').scalar_one() == 0
    engine.dispose()
