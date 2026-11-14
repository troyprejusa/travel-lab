"""Insert development sample data in one transaction."""
import asyncio
import psycopg
from database_config import database_url
from models.database_seed import DatabaseSeed


class SeedConnection:
    def __init__(self, connection):
        self.connection = connection

    async def query(self, sql):
        await self.connection.execute(sql)


async def seed():
    url = database_url()
    async with await psycopg.AsyncConnection.connect(host=url.host, port=url.port, user=url.username,
                                                     password=url.password, dbname=url.database) as connection:
        await DatabaseSeed(SeedConnection(connection)).insert_data()
        for table in ('poll', 'poll_option', 'poll_vote'):
            await connection.execute(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), (SELECT MAX(id) FROM {table}))")


if __name__ == '__main__':
    asyncio.run(seed())
