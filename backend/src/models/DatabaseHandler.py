import psycopg2
import psycopg2.extras
from utilities import Constants

settings = {
    'host': Constants.DB_HOST,
    'port': Constants.DB_PORT,
    'user': Constants.DB_USER,
    'password': Constants.DB_PWD,
    'database': Constants.DB_DBNAME
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
            print('DatabaseHandler.py: Attempting to connect to database...')
            self.connection = psycopg2.connect(host = host, port = port, user = user, password = password, database = database)
            print('DatabaseHandler.py: Connected to database')
        except Exception as error:
            print(error)
            raise Exception(f"DatabaseHandler.py: Unable to connect to database{settings['database']}")

    '''
    Wrap the cursor.execute method as to open and close a cursor,
    print the executed query, and report its success/failure
    Still throw an error, as the caller needs to know if the
    query failed
    '''
    def query(self, query: str, params: None | tuple | dict = None, **kwargs) -> None | list[dict] | int:
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
                    
                    if kwargs.get('row_count_only'):
                        # if row_count_only is specified and truthy,
                        # get the number of affected items
                        data = cursor.rowcount

                        return data
                    
                    else:
                        # If the query returns a value, return it to the user
                        try:
                            data = cursor.fetchall()

                            # Convert to normal dict
                            array_of_dicts = [dict(row) for row in data]

                            return array_of_dicts
                        
                        except psycopg2.ProgrammingError:
                            # This is needed because executing fetchall()
                            # on psql statements not explicitly returning 
                            # anything (CREATE, DROP, INSERT, UPDATE, DELETE, etc.)
                            # will throw an error
                            return None

                except psycopg2.Error as pg_error:
                    # print(f'QUERY FAILURE!')
                    print(f'QUERY FAILURE:\n\t{cursor.query}')
                    raise pg_error
    

# CREATE DATABASE HANDLER
db_handler = DatabaseHandler(**settings)
