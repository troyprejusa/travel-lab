from models.DatabaseHandler import DatabaseHandler

class DatabaseSetup:
    def __init__(self, database: DatabaseHandler) -> None:
        self.database = database;
    
    # UUID Extension
    def initialize_extensions(self) -> None:
        self.database.query("""
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        """)
    
    def intialize_traveller_table(self) -> None:
        # As this is now provided by Auth0, we only have the email by default
        self.database.query("""
            CREATE TABLE IF NOT EXISTS traveller (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                first_name VARCHAR(40),
                last_name VARCHAR(40),
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(11)
            );
        """)
    
    def drop_traveller_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS traveller CASCADE;
        """)

    def initialize_trip_table(self) -> None:
        self.database.query("""
            CREATE TABLE IF NOT EXISTS trip (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                destination VARCHAR(60) NOT NULL,
                description VARCHAR(200),
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
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
                    confirmed BOOLEAN NOT NULL DEFAULT FALSE, 
                    admin BOOLEAN NOT NULL DEFAULT FALSE,
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
                trip_id uuid NOT NULL references trip ON DELETE CASCADE,
                title VARCHAR(60) NOT NULL,
                description VARCHAR(200),
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
            );
        """)

    def drop_itinerary_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS itinerary;
        """)

    def initialize_messages_table(self) -> None:
        self.database.query("""
            CREATE TABLE IF NOT EXISTS message (
                id BIGSERIAL PRIMARY KEY,
                trip_id uuid NOT NULL references trip ON DELETE CASCADE,
                content VARCHAR(1100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
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
                trip_id uuid NOT NULL references trip ON DELETE CASCADE,
                title VARCHAR(40) NOT NULL,
                anonymous BOOLEAN NOT NULL,
                description VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
            );
                            
            CREATE TABLE IF NOT EXISTS poll_option (
                id BIGSERIAL PRIMARY KEY,
                poll_id BIGINT NOT NULL references poll ON DELETE CASCADE,
                option VARCHAR(120) NOT NULL
            );
                            
            CREATE TABLE IF NOT EXISTS poll_vote (
                id BIGSERIAL PRIMARY KEY,
                poll_id BIGINT NOT NULL references poll ON DELETE CASCADE,
                vote BIGINT NOT NULL references poll_option ON DELETE CASCADE,
                voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                voted_by VARCHAR(255) NOT NULL references traveller(email) ON DELETE CASCADE,
                UNIQUE (poll_id, voted_by)
            );
        """)

    def drop_poll_tables(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS poll CASCADE;
                                
            DROP TABLE IF EXISTS poll_option CASCADE;
                                
            DROP TABLE IF EXISTS poll_vote;
        """)

    def initialize_packing_table(self) -> None:
        self.database.query("""                            
            CREATE TABLE IF NOT EXISTS packing (
                id BIGSERIAL PRIMARY KEY,
                trip_id UUID NOT NULL references trip ON DELETE CASCADE,
                item VARCHAR(64) NOT NULL,
                quantity INTEGER NOT NULL,
                description VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL,
                packed_by VARCHAR(255) references traveller(email) ON DELETE SET NULL 
            );
        """)

    def drop_packing_table(self) -> None:
        self.database.query("""
            DROP TABLE IF EXISTS packing;
        """)

    def setup_db(self) -> None:
        self.initialize_extensions()
        self.intialize_traveller_table()
        self.initialize_trip_table()
        self.initialize_traveller_trip_table()
        self.initialize_itinerary_table()
        self.initialize_messages_table()
        self.initialize_poll_tables()
        self.initialize_packing_table()
    
    def drop_tables(self) -> None:
        self.drop_traveller_table()
        self.drop_trip_table()
        self.drop_traveller_trip_table()
        self.drop_itinerary_table()
        self.drop_messages_table()
        self.drop_poll_tables()
        self.drop_packing_table()

    def insert_data(self):
        self.insert_users()
        self.insert_trips()
        self.add_users_to_trips()
        self.insert_itinerary()
        self.insert_messages()
        self.insert_polls()
        self.insert_packing()

    def insert_users(self):
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
        """)

    def insert_trips(self):
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
                '47fc5568-568e-4124-9e08-60508719dfb6',
                'Europe',
                'Boys trip',
                '2023-08-30',
                '2023-08-31',
                'joe@test.com'
            );
            
        """)

    def add_users_to_trips(self):
        # Add both users to both trips
        self.database.query("""
            INSERT INTO traveller_trip 
            VALUES (
                (SELECT id FROM traveller WHERE first_name='troy'),
                (SELECT id FROM trip WHERE destination='Puerto Vallarta'),
                TRUE,
                TRUE
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                (SELECT id FROM trip WHERE destination='Puerto Vallarta'),
                TRUE,
                FALSE
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='troy'),
                (SELECT id FROM trip WHERE destination='Cabo'),
                TRUE,
                FALSE
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                (SELECT id FROM trip WHERE destination='Cabo'),
                TRUE,
                TRUE
            );
        """)

    def insert_itinerary(self):
        self.database.query("""
            INSERT INTO itinerary (trip_id, title, description, start_time, end_time, created_by)
            VALUES (
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'The Beach',
                'First stop on the trip!!',
                '2023-09-04 14:30:00',
                '2023-09-04 18:00:00',
                'troy@test.com'
            );
                            
            INSERT INTO itinerary (trip_id, title, start_time, end_time, created_by)
            VALUES (
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'Dinner Reservation',
                '2023-09-06 19:00:00',
                '2023-06-06 20:00:00',
                'troy@test.com'
            );
        """)

    def insert_messages(self):
        self.database.query("""
            INSERT INTO message (trip_id, content, created_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'message from joe', 'joe@test.com');
                            
            INSERT INTO message (trip_id, content, created_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'message from troy', 'troy@test.com');
        """)

    def insert_polls(self):
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
                101,
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'test poll',
                TRUE,
                'troy@test.com'
            );
                            
            INSERT INTO poll_option (id, poll_id, option) VALUES (201, 101, 'first');
            INSERT INTO poll_option (id, poll_id, option) VALUES (202, 101, 'second');
                            
            INSERT INTO poll (
                id,
                trip_id,
                title,
                anonymous,
                description,
                created_by
            )
            VALUES (
                102,
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'test poll 2',
                FALSE,
                'WAZZAP',
                'joe@test.com'
            );
                            
            INSERT INTO poll_option (id, poll_id, option) VALUES (203, 102, 'option a');
            INSERT INTO poll_option (id, poll_id, option) VALUES (204, 102, 'option b');
            INSERT INTO poll_option (id, poll_id, option) VALUES (205, 102, 'option c');
                            
            INSERT INTO poll_vote (id, poll_id, vote, voted_by) VALUES (301, 102, 204, 'joe@test.com');
        """)

    def insert_packing(self):
        self.database.query("""
            INSERT INTO packing (trip_id, item, quantity, description, created_by, packed_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'pans', 2, 'safe for grilling', 'joe@test.com', 'troy@test.com');
                            
            INSERT INTO packing (trip_id, item, quantity, created_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'spatula', 5, 'troy@test.com');
                            
            INSERT INTO packing (trip_id, item, quantity, description, created_by, packed_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'firestarter', 1, 'Please bring something easy to use', 'troy@test.com', 'joe@test.com');
        """)
        