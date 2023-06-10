import psycopg2

class DatabaseHandler:
    def __init__(self, host: str, port: str, user: str, password: str, database: str) -> None:
        try:
            self.connection = psycopg2.connect(host = host, port = port, user = user, password = password, database = database)
            print('Connected to database')
        except Exception as e:
            print(str(e))
            raise Exception('Unable to connect to database')

    def query(self, query: str) -> None:
        with self.connection as conn:
            with conn.cursor() as cursor:
                try:
                    cursor.execute(query)
                    print(cursor.query)
                except psycopg2.Error as pg_error:
                    print(str(pg_error))


settings = {
    'host': "localhost",
    'port': "5433",
    'user': "docker",
    'password': "docker",
    'database': "travel_lab"
}

# CREATE DATABASE HANDLER
db_handler = DatabaseHandler(**settings)


class DatabaseSetup:
    def __init__(self, database: DatabaseHandler) -> None:
        self.database = database;

    def initalize_test_table(self):
        self.database.query("""
            DROP TABLE test;
        """)
        self.database.query(""" 
            CREATE TABLE IF NOT EXISTS test(name varchar(40));
        """)

# SETUP DB TABLES
db_setup = DatabaseSetup(db_handler)
db_setup.initalize_test_table()
