import psycopg2
from models.mock_data import insert_data

settings = {
    'host': "localhost",
    'port': "5433",
    'user': "docker",
    'password': "docker",
    'database': "travel_lab"
}

class DatabaseHandler:
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
    def query(self, query: str) -> None:
        with self.connection as conn:
            with conn.cursor() as cursor:
                try:
                    cursor.execute(query)
                    # print(f'QUERY SUCCESS:\n\t{cursor.query}')
                except psycopg2.Error as pg_error:
                    print(f'QUERY FAILURE:\n\t{cursor.query}')
                    raise pg_error

# CREATE DATABASE HANDLER
db_handler = DatabaseHandler(**settings)


class DatabaseSetup:
    def __init__(self, database: DatabaseHandler) -> None:
        self.database = database;
    
    def initialize_extensions(self):
        self.database.query("""
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        """)
    
    def create_types(self):
        self.database.query("""
            DROP TYPE transp_mode;
            CREATE TYPE transp_mode AS ENUM (
                'plane',
                'car',
                'train',
                'bus',
                'boat',
                'other'
            );
        """)

    def initalize_test_table(self):
        self.database.query("""
            DROP TABLE IF EXISTS test;
        """)
        self.database.query(""" 
            CREATE TABLE IF NOT EXISTS test (
                name varchar(40)
            );
            INSERT INTO test (name) VALUES ('troy');
        """)
    
    def intialize_traveller_table(self):
        self.database.query("""
            CREATE TABLE IF NOT EXISTS traveller (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                first_name VARCHAR(40),
                last_name VARCHAR(40),
                email VARCHAR(320) UNIQUE,
                phone VARCHAR(11)
            );
        """)
    
    def drop_traveller_table(self):
        self.database.query("""
            DROP TABLE IF EXISTS traveller CASCADE;
        """)

    def initialize_auth_table(self):
        pass

    def drop_auth_table(self):
        pass

    def initialize_trip_table(self):
        self.database.query("""
            CREATE TABLE IF NOT EXISTS trip (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                destination VARCHAR(60),
                description VARCHAR(200),
                start_date DATE,
                end_date DATE
            );
        """)

    def drop_trip_table(self):
        self.database.query("""
            DROP TABLE IF EXISTS trip CASCADE;
        """)

    def initialize_traveller_trip_table(self):
        self.database.query("""
                CREATE TABLE IF NOT EXISTS traveller_trip (
                    traveller_id uuid references traveller,
                    trip_id uuid references trip,
                    PRIMARY KEY (traveller_id, trip_id)
            );
        """)

    def drop_traveller_trip_table(self):
        self.database.query("""
            DROP TABLE IF EXISTS traveller_trip;
        """)

    def initialize_itinerary_table(self):
        self.database.query("""
            CREATE TABLE IF NOT EXISTS itinerary (
                id BIGSERIAL PRIMARY KEY,
                traveller_id uuid references traveller,
                trip_id uuid references trip,
                title VARCHAR(60),
                description VARCHAR(200),
                start_date TIMESTAMP,
                end_date TIMESTAMP
            );
        """)

    def drop_itinerary_table(self):
        self.database.query("""
            DROP TABLE IF EXISTS itinerary;
        """)

    def intialize_transportation_table(self):
        self.database.query("""
            CREATE TABLE IF NOT EXISTS itinerary (
                id BIGSERIAL PRIMARY KEY,
                traveller_id uuid references traveller,
                trip_id uuid references trip,
                title VARCHAR(60),
                mode transp_mode,
                details VARCHAR(200),
                start_date TIMESTAMP,
                end_date TIMESTAMP
            );
        """)
    
    def drop_transportation_table(self):
        self.database.query("""
            DROP TABLE IF EXISTS transportation;
        """)

    def initialize_messages_table(self):
        # self.database.query("""
            
        # """)
        pass

    def initialize_packing_table(self):
        # self.database.query("""
            
        # """)
        pass

    def setup_db(self):
        self.initialize_extensions()
        self.create_types()
        self.initalize_test_table()
        self.intialize_traveller_table()
        self.initialize_trip_table()
        self.initialize_traveller_trip_table()
        self.initialize_itinerary_table()
    
    def drop_tables(self):
        self.drop_traveller_table()
        self.drop_trip_table()
        self.drop_traveller_trip_table()
        self.drop_itinerary_table()


# DB SETUP DEV ONLY
db_setup = DatabaseSetup(db_handler)
db_setup.drop_tables()
db_setup.setup_db()
insert_data(db_handler)
