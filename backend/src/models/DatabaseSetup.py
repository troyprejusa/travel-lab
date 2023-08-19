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
                email VARCHAR(255) UNIQUE,
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
                email VARCHAR(255) PRIMARY KEY references traveller(email) ON DELETE CASCADE,
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
                end_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE CASCADE
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
                trip_id uuid references trip ON DELETE CASCADE,
                title VARCHAR(60),
                description VARCHAR(200),
                start_time TIMESTAMP,
                end_time TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE CASCADE
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
        self.database.query("""
            CREATE TABLE IF NOT EXISTS message (
                id BIGSERIAL PRIMARY KEY,
                trip_id uuid references trip ON DELETE CASCADE,
                content VARCHAR(1100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE CASCADE
            );
        """)
    
    def drop_messages_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS message;
        """)
    
    def initialize_poll_tables(self) -> None:
        '''
        The relationship below is poll -> poll_option -> poll_vote
        Once a poll is created, its fields will be locked in. There
        will be no way or reason to modify the poll title or options
        after creation, as it creates a scenario where the title, 
        votes, or vote options are not captured faithfully as to
        when people voted.

        To add your votes, simply send over the option you want, 
        which is a reference to the poll_option(id) field
        '''
        self.database.query("""
            CREATE TABLE IF NOT EXISTS poll (
                id BIGSERIAL PRIMARY KEY,
                trip_id uuid references trip ON DELETE CASCADE,
                title VARCHAR(40),
                anonymous BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE CASCADE
            );
                            
            CREATE TABLE IF NOT EXISTS poll_option (
                id BIGSERIAL PRIMARY KEY,
                poll_id BIGINT references poll ON DELETE CASCADE,
                option VARCHAR(120)
            );
                            
            CREATE TABLE IF NOT EXISTS poll_vote (
                id BIGSERIAL PRIMARY KEY,
                vote BIGSERIAL references poll_option ON DELETE CASCADE,
                voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                voted_by VARCHAR(255) references traveller(email) ON DELETE CASCADE 
            );
        """)

    def drop_poll_tables(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS poll CASCADE;
                                
            DROP TABLE IF EXISTS poll_option CASCADE;
                                
            DROP TABLE IF EXISTS poll_vote;
        """)

    def initialize_packing_table(self) -> None:
        # self.database.query("""
            
        # """)
        pass

    def drop_packing_table(self) -> None:
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
        self.initialize_messages_table()
        self.initialize_poll_tables()
    
    def drop_tables(self) -> None:
        self.drop_traveller_table()
        self.drop_auth_table()
        self.drop_trip_table()
        self.drop_traveller_trip_table()
        self.drop_itinerary_table()
        self.drop_messages_table()
        self.drop_poll_tables()

    def insert_data(self):
        # Insert a fake user troy
        self.database.query("""
            INSERT INTO traveller 
            VALUES (
                'ce475240-1b9f-4c52-900b-a83af218896a',
                'troy',
                'prejusa',
                'troy@test.com',
                '1234567890'
            );

            INSERT INTO auth 
            VALUES (
                'troy@test.com',
                '$2b$12$k.Sh6JulrK/e/R3bFKQ36OaKf/UjaWjDXQLYEVbhHTcZ43GzU7g6e'
            );
        """)

        # Insert a fake user "joe"
        self.database.query("""
            INSERT INTO traveller 
            VALUES (
                '4d17d823-e31c-47c9-81ad-a53dff295e6b',
                'joe',
                'schmo',
                'joe@test.com',
                '1234567890'
            );

            INSERT INTO auth 
            VALUES (
                'joe@test.com',
                '$2b$12$k.Sh6JulrK/e/R3bFKQ36OaKf/UjaWjDXQLYEVbhHTcZ43GzU7g6e'
            );
        """)

        # Insert two trips
        self.database.query("""
            INSERT INTO trip 
            (
                id,
                destination,
                description,
                start_date,
                end_date,
                created_by
            )
            VALUES (
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'Puerto Vallarta',
                'Getaway trip',
                '2020-06-10',
                '2020-06-11',
                'troy@test.com'
            );

            INSERT INTO trip 
            (
                id,
                destination,
                description,
                start_date,
                end_date,
                created_by
            )
            VALUES (
                'ce60fd7b-6238-4bef-a924-269597fdaab1',
                'Cabo',
                'Getaway trip 2',
                '2020-07-10',
                '2020-07-11',
                'joe@test.com'
            );
        """)

        # Add both users to both trips
        self.database.query("""
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

        # Insert some fake polls
        self.database.query("""
            INSERT INTO poll (
                id,
                trip_id,
                title,
                anonymous,
                created_by
            )
            VALUES (
                98,
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'test poll',
                TRUE,
                'troy@test.com'
            );
                            
            INSERT INTO poll_option (id, poll_id, option) VALUES (101, 98, 'first');
            INSERT INTO poll_option (id, poll_id, option) VALUES (102, 98, 'second');
                            
            INSERT INTO poll (
                id,
                trip_id,
                title,
                anonymous,
                created_by
            )
            VALUES (
                99,
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'test poll 2',
                FALSE,
                'troy@test.com'
            );
                            
            INSERT INTO poll_option (id, poll_id, option) VALUES (103, 99, 'option a');
            INSERT INTO poll_option (id, poll_id, option) VALUES (104, 99, 'option b');
            INSERT INTO poll_option (id, poll_id, option) VALUES (105, 99, 'option c');
        """)

