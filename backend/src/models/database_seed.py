"""Sample data used by local development and tests."""


class DatabaseSeed:
    def __init__(self, database):
        self.database = database

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

        