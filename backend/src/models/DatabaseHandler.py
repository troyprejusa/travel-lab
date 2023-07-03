import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
load_dotenv()

settings = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PWD'),
    'database': os.getenv('DB_DBNAME')
}

class DatabaseHandler:
    """
    Abstracting the database querying functionality into this class so that it
    can more easily be replaced with other means if desired
    """
    def __init__(self, host: str, port: str, user: str, password: str, database: str) -> None:
        self.host= host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

        try:
            self.connection = psycopg2.connect(host = host, port = port, user = user, password = password, database = database)
            print('Connected to database')
        except Exception as e:
            print(str(e))
            raise Exception(f"Unable to connect to database{settings['database']}")

    '''
    Wrap the cursor.execute method as to open and close a cursor,
    print the executed query, and report its success/failure
    Still throw an error, as the caller needs to know if the
    query failed
    '''
    def query(self, query: str, params: None | tuple | dict = None) -> None | list[tuple]:
        # Use connection context manager for autocommit/rollback
        with self.connection as conn:
            # Use cursor context manager to automatically close cursor
            with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as cursor:
                try:
                    if params is not None:
                        cursor.execute(query, params)
                    else:
                        cursor.execute(query)

                    # print(f'QUERY SUCCESS:\n\t{cursor.query}')

                    # If the query returns a value, return it to the user
                    try:
                        data = cursor.fetchall()

                        # Convert to normal dict
                        array_of_dicts = [dict(row) for row in data]

                        return array_of_dicts
                    
                    except psycopg2.ProgrammingError as pe:
                        return None

                except psycopg2.Error as pg_error:
                    print(f'QUERY FAILURE:\n\t{cursor.query}')
                    raise pg_error
    

# CREATE DATABASE HANDLER
db_handler = DatabaseHandler(**settings)
