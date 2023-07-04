from models.DatabaseHandler import DatabaseHandler

class DatabaseSetup:
    def __init__(self, database: DatabaseHandler) -> None:
        self.database = database;
    
    def initialize_extensions(self) -> None:
        self.database.query("""
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        """)
    
    def create_types(self) -> None:
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

    def initalize_test_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS test;
        """)
        self.database.query(""" 
            CREATE TABLE IF NOT EXISTS test (
                name varchar(40)
            );
            INSERT INTO test (name) VALUES ('troy');
        """)
    
    def intialize_traveller_table(self) -> None:
        self.database.query("""
            CREATE TABLE IF NOT EXISTS traveller (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                first_name VARCHAR(40),
                last_name VARCHAR(40),
                email VARCHAR(320) UNIQUE,
                phone VARCHAR(11)
            );
        """)
    
    def drop_traveller_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS traveller CASCADE;
        """)

    def initialize_auth_table(self) -> None:
        self.database.query("""
            CREATE TABLE IF NOT EXISTS auth (
                email VARCHAR(320) PRIMARY KEY references traveller(email) ON DELETE CASCADE,
                password VARCHAR(255)
            );
        """)

    def drop_auth_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS auth;
        """)

    def initialize_trip_table(self) -> None:
        self.database.query("""
            CREATE TABLE IF NOT EXISTS trip (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                destination VARCHAR(60),
                description VARCHAR(200),
                start_date DATE,
                end_date DATE
            );
        """)

    def drop_trip_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS trip CASCADE;
        """)

    def initialize_traveller_trip_table(self) -> None:
        self.database.query("""
                CREATE TABLE IF NOT EXISTS traveller_trip (
                    traveller_id uuid references traveller ON DELETE CASCADE,
                    trip_id uuid references trip ON DELETE CASCADE,
                    PRIMARY KEY (traveller_id, trip_id)
            );
        """)

    def drop_traveller_trip_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS traveller_trip;
        """)

    def initialize_itinerary_table(self) -> None:
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

    def drop_itinerary_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS itinerary;
        """)

    def intialize_transportation_table(self) -> None:
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
    
    def drop_transportation_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS transportation;
        """)

    def initialize_messages_table(self) -> None:
        # self.database.query("""
            
        # """)
        pass

    def initialize_packing_table(self) -> None:
        # self.database.query("""
            
        # """)
        pass

    def setup_db(self) -> None:
        self.initialize_extensions()
        self.create_types()
        self.initalize_test_table()
        self.intialize_traveller_table()
        self.initialize_auth_table()
        self.initialize_trip_table()
        self.initialize_traveller_trip_table()
        self.initialize_itinerary_table()
    
    def drop_tables(self) -> None:
        self.drop_traveller_table()
        self.drop_auth_table()
        self.drop_trip_table()
        self.drop_traveller_trip_table()
        self.drop_itinerary_table()

    @staticmethod
    def insert_data(database):
        # Insert a user
        database.query("""
            INSERT INTO traveller 
            VALUES (
                'ce475240-1b9f-4c52-900b-a83af218896a',
                'troy',
                'prejusa',
                'troy@test.com',
                '1234567890'
            );
        """)

        # Add a password for fake user troy
        # Encoded password 'abcd'
        database.query("""
            INSERT INTO auth 
            VALUES (
                'troy@test.com',
                '$2b$12$k.Sh6JulrK/e/R3bFKQ36OaKf/UjaWjDXQLYEVbhHTcZ43GzU7g6e'
            );
        """)

        # Insert a user
        database.query("""
            INSERT INTO traveller 
            VALUES (
                '4d17d823-e31c-47c9-81ad-a53dff295e6b',
                'joe',
                'schmo',
                'joe@test.com',
                '1234567890'
            );
        """)

        # Add a password for fake user joe
        # Encoded password 'abcd'
        database.query("""
            INSERT INTO auth 
            VALUES (
                'joe@test.com',
                '$2b$12$k.Sh6JulrK/e/R3bFKQ36OaKf/UjaWjDXQLYEVbhHTcZ43GzU7g6e'
            );
        """)
        # Insert a trip
        database.query("""
            INSERT INTO trip 
            (
                destination,
                description,
                start_date,
                end_date
            )
            VALUES (
                'Puerto Vallarta',
                'Getaway trip',
                '2020-06-10',
                '2020-06-11'
            );
        """)

        # Insert a trip
        database.query("""
            INSERT INTO trip 
            (
                destination,
                description,
                start_date,
                end_date
            )
            VALUES (
                'Cabo',
                'Getaway trip 2',
                '2020-07-10',
                '2020-07-11'
            );
        """)

        # Add both users to both trips
        database.query("""
            INSERT INTO traveller_trip 
            VALUES (
                (SELECT id FROM traveller WHERE first_name='troy'),
                (SELECT id FROM trip WHERE destination='Puerto Vallarta')
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                (SELECT id FROM trip WHERE destination='Puerto Vallarta')
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='troy'),
                (SELECT id FROM trip WHERE destination='Cabo')
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                (SELECT id FROM trip WHERE destination='Cabo')
            );
        """)

