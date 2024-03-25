from .DatabaseHandler import PsycopgDatabaseHandler


class DatabaseSetup:
    def __init__(self, database: PsycopgDatabaseHandler) -> None:
        self.database = database;
    
    # UUID Extension
    async def initialize_extensions(self) -> None:
        await self.database.query("""
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        """)

    async def create_types(self) -> None:
        await self.database.query("""
            DROP TYPE IF EXISTS vacation_setting;
                                
            CREATE TYPE vacation_setting AS ENUM (
                'tropical', 
                'wilderness', 
                'city', 
                'historical',
                'countryside',
                'road_trip',
                'winter'
            );
        """)
    
    async def intialize_traveller_table(self) -> None:
        # As this is now provided by Auth0, we only have the email by DEFAULT
        await self.database.query("""
            CREATE TABLE IF NOT EXISTS traveller (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                first_name VARCHAR(40),
                last_name VARCHAR(40),
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(11)
            );
        """)
    
    async def drop_traveller_table(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS traveller CASCADE;
        """)

    async def initialize_trip_table(self) -> None:
        await self.database.query("""
            CREATE TABLE IF NOT EXISTS trip (
                id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
                destination VARCHAR(60) NOT NULL,
                description VARCHAR(200),
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                vacation_type vacation_setting NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
            );
        """)

    async def drop_trip_table(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS trip CASCADE;
        """)

    async def initialize_traveller_trip_table(self) -> None:
        await self.database.query("""
                CREATE TABLE IF NOT EXISTS traveller_trip (
                    traveller_id uuid references traveller ON DELETE CASCADE,
                    trip_id uuid references trip ON DELETE CASCADE,
                    confirmed BOOLEAN NOT NULL DEFAULT FALSE, 
                    admin BOOLEAN NOT NULL DEFAULT FALSE,
                    PRIMARY KEY (traveller_id, trip_id)
            );
        """)

    async def drop_traveller_trip_table(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS traveller_trip;
        """)

    async def initialize_itinerary_table(self) -> None:
        await self.database.query("""
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

    async def drop_itinerary_table(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS itinerary;
        """)

    async def initialize_messages_table(self) -> None:
        await self.database.query("""
            CREATE TABLE IF NOT EXISTS message (
                id BIGSERIAL PRIMARY KEY,
                trip_id uuid NOT NULL references trip ON DELETE CASCADE,
                content VARCHAR(1100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by VARCHAR(255) references traveller(email) ON DELETE SET NULL
            );
        """)
    
    async def drop_messages_table(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS message;
        """)
    
    async def initialize_poll_tables(self) -> None:
        '''
        The relationship below is poll -> poll_option -> poll_vote
        Once a poll is created, its fields will be locked in. There
        will be no way or reason to modify the poll title or options
        after creation, as it creates a scenario where the title, 
        votes, or vote options are not captured faithfully as to
        when people voted.

        EDIT: The poll_id was added to poll_vote so that a join-able
        relationship exists for all 3 tables

        To add your votes, simply send over the option you want, 
        which is a reference to the poll_option(id) field
        '''
        await self.database.query("""
            CREATE TABLE IF NOT EXISTS poll (
                id BIGSERIAL PRIMARY KEY,
                trip_id uuid NOT NULL references trip ON DELETE CASCADE,
                title VARCHAR(40) NOT NULL,
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

    async def drop_poll_tables(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS poll CASCADE;
                                
            DROP TABLE IF EXISTS poll_option CASCADE;
                                
            DROP TABLE IF EXISTS poll_vote;
        """)

    async def initialize_packing_table(self) -> None:
        await self.database.query("""                            
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

    async def drop_packing_table(self) -> None:
        await self.database.query("""
            DROP TABLE IF EXISTS packing;
        """)

    async def setup_db(self) -> None:
        await self.initialize_extensions()
        await self.create_types()
        await self.intialize_traveller_table()
        await self.initialize_trip_table()
        await self.initialize_traveller_trip_table()
        await self.initialize_itinerary_table()
        await self.initialize_messages_table()
        await self.initialize_poll_tables()
        await self.initialize_packing_table()
    
    async def drop_tables(self) -> None:
        await self.drop_traveller_table()
        await self.drop_trip_table()
        await self.drop_traveller_trip_table()
        await self.drop_itinerary_table()
        await self.drop_messages_table()
        await self.drop_poll_tables()
        await self.drop_packing_table()

    async def insert_data(self):
        await self.insert_users()
        await self.insert_trips()
        await self.add_users_to_trips()
        await self.insert_itinerary()
        await self.insert_messages()
        await self.insert_polls()
        await self.insert_packing()

    async def insert_users(self):
        # Insert a fake user troy
        await self.database.query("""
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
        await self.database.query("""
            INSERT INTO traveller 
            VALUES (
                '4d17d823-e31c-47c9-81ad-a53dff295e6b',
                'joe',
                'schmo',
                'joe@test.com',
                '1234567890'
            );
        """)

    async def insert_trips(self):
         # Insert two trips
        await self.database.query("""
            INSERT INTO trip 
            (
                id,
                destination,
                description,
                start_date,
                end_date,
                created_by,
                vacation_type
            )
            VALUES (
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'Thailand',
                'Getaway trip',
                '2023-11-10',
                '2023-11-19',
                'troy@test.com',
                'tropical'
            );

            INSERT INTO trip 
            (
                id,
                destination,
                description,
                start_date,
                end_date,
                created_by,
                vacation_type
            )
            VALUES (
                'ce60fd7b-6238-4bef-a924-269597fdaab1',
                'New York City',
                'Visit friends and eat halal',
                '2024-04-19',
                '2024-04-21',
                'troy@test.com',
                'city'
            );
                            
            INSERT INTO trip 
            (
                id,
                destination,
                description,
                start_date,
                end_date,
                created_by,
                vacation_type
            )
            VALUES (
                '47fc5568-568e-4124-9e08-60508719dfb6',
                'Greece',
                'Boys trip',
                '2023-08-30',
                '2023-08-31',
                'joe@test.com',
                'historical'
            );
            
        """)

    async def add_users_to_trips(self):
        '''
        Add Troy to trip 1 (confirmed, admin), 2 (confirmed, admin), and 3 (need to request)
        Add Joe to trip 1 (confirmed), 2 (not confirmed), and 3 (confirmed, admin)
        '''
        await self.database.query("""
            INSERT INTO traveller_trip 
            VALUES (
                (SELECT id FROM traveller WHERE first_name='troy'),
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                TRUE,
                TRUE
            );

            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='troy'),
                'ce60fd7b-6238-4bef-a924-269597fdaab1',
                TRUE,
                TRUE
            );
                            
            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                TRUE,
                FALSE
            );


            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                'ce60fd7b-6238-4bef-a924-269597fdaab1',
                FALSE,
                FALSE
            );
                            
            INSERT INTO traveller_trip 
                VALUES (
                (SELECT id FROM traveller WHERE first_name='joe'),
                '47fc5568-568e-4124-9e08-60508719dfb6',
                TRUE,
                TRUE
            );
        """)

    async def insert_itinerary(self):
        await self.database.query("""
            INSERT INTO itinerary (trip_id, title, description, start_time, end_time, created_by)
            VALUES (
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'Maya Beach',
                'First stop on the trip!',
                '2023-11-13 13:00:00',
                '2023-11-13 16:00:00',
                'troy@test.com'
            );
                            
            INSERT INTO itinerary (trip_id, title, start_time, end_time, created_by)
            VALUES (
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'Dinner Reservation',
                '2023-11-16 18:00:00',
                '2023-11-16 20:00:00',
                'joe@test.com'
            );
        """)

    async def insert_messages(self):
        await self.database.query("""
            INSERT INTO message (trip_id, content, created_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'Hey its joe. Are you guys are stoked or what?', 'joe@test.com');
                            
            INSERT INTO message (trip_id, content, created_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'Cant wait for the trip! - troy', 'troy@test.com');
        """)

    async def insert_polls(self):
        # Insert some fake polls
        await self.database.query("""
            INSERT INTO poll (
                id,
                trip_id,
                title,
                created_by
            )
            VALUES (
                101,
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'More time in Phuket or Bangkok?',
                'troy@test.com'
            );
                            
            INSERT INTO poll_option (id, poll_id, option) VALUES (201, 101, 'Phuket');
            INSERT INTO poll_option (id, poll_id, option) VALUES (202, 101, 'Bangkok');
                            
            INSERT INTO poll (
                id,
                trip_id,
                title,
                description,
                created_by
            )
            VALUES (
                102,
                'ac0a3381-8a5f-4abf-979a-e417bb5d6e65',
                'First Night Dinner',
                'What should we eat for dinner after the flight into town?',
                'joe@test.com'
            );
                            
            INSERT INTO poll_option (id, poll_id, option) VALUES (203, 102, 'appetizers');
            INSERT INTO poll_option (id, poll_id, option) VALUES (204, 102, 'seafood');
            INSERT INTO poll_option (id, poll_id, option) VALUES (205, 102, 'barbecue');
                            
            INSERT INTO poll_vote (id, poll_id, vote, voted_by) VALUES (301, 102, 204, 'joe@test.com');
        """)

    async def insert_packing(self):
        await self.database.query("""
            INSERT INTO packing (trip_id, item, quantity, description, created_by, packed_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'sunscreen', 2, 'spray-on preferred', 'joe@test.com', 'troy@test.com');
                            
            INSERT INTO packing (trip_id, item, quantity, created_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'bug spray', 2, 'troy@test.com');
                            
            INSERT INTO packing (trip_id, item, quantity, description, created_by, packed_by)
            VALUES ('ac0a3381-8a5f-4abf-979a-e417bb5d6e65', 'underwater camera', 1, 'maybe a selfie-stick too?', 'troy@test.com', 'joe@test.com');
        """)

        