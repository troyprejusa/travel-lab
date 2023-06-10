def insert_data(database):
    # Insert a user
    database.query("""
        INSERT INTO traveller 
        (
            first_name,
            last_name,
            email,
            phone
        )
        VALUES (
            'troy',
            'prejusa',
            'troy@test.com',
            '1234567890'
        );
    """)

    # Insert a user
    database.query("""
        INSERT INTO traveller 
        (
            first_name,
            last_name,
            email,
            phone
        )
        VALUES (
            'joe',
            'schmo',
            'joe@test.com',
            '1234567890'
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