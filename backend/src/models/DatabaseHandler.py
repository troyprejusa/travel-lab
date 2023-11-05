import psycopg2
import psycopg2.extras
from utilities import Constants
from utilities.merge_polls import merge_polls
from datetime import date


class PsycopgDatabaseHandler:
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

        self.connect();
        
    def connect(self):
        try:
            self.connection = psycopg2.connect(host = self.host, port = self.port, user = self.user, password = self.password, database = self.database)
        except Exception as error:
            print(error)
            raise Exception(f"DatabaseHandler.py: Unable to connect to database{self.database}")

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
                        return cursor.rowcount
                    
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
                        
                        except (psycopg2.OperationalError, psycopg2.InterfaceError):
                            # If there's an issue with the connection, attempt to reconnect
                            if self.connection.closed != 0:
                                self.connection.close()
                                self.connect()

                except psycopg2.Error as pg_error:
                    # print(f'QUERY FAILURE!')
                    print(f'QUERY FAILURE:\n\t{cursor.query}')
                    raise pg_error
                
    # ------------------- USER OPERATIONS ------------------- #
                
    def upsert_user(self, email: str) -> dict:
        user = self.query("""
            INSERT INTO traveller (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;
            SELECT * FROM traveller WHERE email=%s;
        """, (email, email))[0]

        return user
    
    def patch_user_info(self, first_name: str, last_name: str, phone: str, email: str) -> None:
        updated_user = self.query("""
            UPDATE traveller SET first_name=%s, last_name=%s, phone=%s
            WHERE email=%s
            RETURNING *;
        """, (first_name, last_name, phone, email))[0]
        
        return updated_user
    
    def delete_user(self, email: str) -> None:
        self.query("DELETE FROM traveller WHERE email=%s;", (email,))

    def get_trips(self, email: str) -> list[dict]:
        data = self.query("""
            SELECT * FROM trip WHERE id in (
                SELECT trip_id FROM traveller_trip WHERE 
                    confirmed = TRUE AND 
                    traveller_id = (
                    SELECT id FROM traveller WHERE email = %s
                )
            );
        """, (email,))

        return data
    
    def leave_trip(self, email: str, trip_id: str) -> None:
        self.query("""
            DELETE FROM traveller_trip WHERE traveller_id = (SELECT id from traveller WHERE email=%s) AND trip_id=%s;
        """, (email, trip_id))
    
    def request_trip(self, email: str, trip_id: str) -> None:
        self.query("""
            INSERT INTO traveller_trip VALUES ((SELECT id from traveller where email=%s), %s, False, False);
        """, (email, trip_id))

    def accept_request(self, requestor_id, trip_id) -> None:
        self.query("""
            UPDATE traveller_trip SET confirmed=TRUE WHERE traveller_id=%s AND trip_id=%s;
        """, (requestor_id, trip_id))

    def remove_traveller(self, traveller_id: str, trip_id: str) -> None:
        self.query("""
            DELETE FROM traveller_trip WHERE traveller_id=%s AND trip_id=%s;
        """, (traveller_id, trip_id))

    # --------------- TRIP OPERATIONS --------------- #

    def create_trip(self, destination: str, description: str, start_date: date, end_date: date, vacation_type: str, email: str) -> str:
        # This call must not only create the trip, but must add
        # this user to the trip in the same transaction so there
        # are no dangling trips
        new_trip_id = self.query("""
            WITH temp_table as (
                INSERT INTO trip 
                (destination, description, start_date, end_date, vacation_type, created_by)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            ) INSERT INTO traveller_trip VALUES ((SELECT id FROM traveller WHERE email=%s), (SELECT id from temp_table), TRUE, TRUE) RETURNING trip_id;
        """, (destination, description, start_date, end_date, vacation_type, email, email))[0]['trip_id']

        return new_trip_id

    def get_trip_data(self, trip_id: str) -> dict:
        trip = self.query("""
            SELECT * FROM trip WHERE id=%s ORDER BY start_date;
        """, (trip_id,))[0]

        return trip
    
    def get_trip_permissions(self, trip_id: str, email: str) -> dict:
        permissions = self.query("""
            SELECT confirmed, admin 
            FROM traveller_trip 
            WHERE trip_id=%s AND 
            traveller_id=(SELECT id FROM traveller WHERE email=%s);
        """, (trip_id, email))[0]

        return permissions

    def delete_trip(self, trip_id: str) -> dict:
        deleted_trip = self.query("""
            DELETE FROM trip WHERE id = %s RETURNING *;
        """, (trip_id,))[0]
        
        return deleted_trip
    
    # --------------- ITINERARY OPERATIONS --------------- #

    def get_itinerary(self, trip_id: str) -> list[dict]:
        itinerary = self.query("""
            SELECT * FROM itinerary WHERE trip_id = %s ORDER BY start_time;
        """, (trip_id,))

        return itinerary
    
    def create_itinerary(self, trip_id: str, title: str, description: str | None, start_time: str, end_time: str, email: str) -> dict:
        new_stop = self.query("""
            INSERT INTO itinerary (trip_id, title, description, start_time, end_time, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *;
        """, (trip_id, title, description, start_time, end_time, email))[0]

        return new_stop

    def delete_itinerary(self, stop_id: int) -> None:
        self.query("""
            DELETE FROM itinerary WHERE id=%s;
        """, (stop_id,))

    # --------------- POLL OPERATIONS --------------- #

    def get_polls(self, trip_id: str) -> list[dict]:
        '''
        The results for one poll on this trip will have the following number
        of rows:
        M options * N people who voted this option, M >= 1 & N >= 1
        Repeat this for P polls. It's kind of a mess to sort through, 
        but at least we get everything we need out of 1 query.
        '''
        polls_and_votes = self.query("""
            SELECT 
                poll.id AS poll_id,
                poll.title,
                poll.description,
                poll.created_at,
                poll.created_by,
                poll_option.id AS option_id,
                poll_option.option,
                poll_vote.voted_by
            FROM 
                poll
            JOIN
                poll_option ON poll.id = poll_option.poll_id
            LEFT JOIN
                poll_vote ON poll_option.id = poll_vote.vote
            WHERE 
                poll.trip_id = %s
            ORDER BY poll.id, poll_option.id;
        """, (trip_id,))

        '''
        With this table of data, we can either group it meaningfully
        on the backend or the frontend. However, in case we want to 
        implement anonymous polling, we will have to handle this on the
        backend. Note that the below logic relies on the data being
        SORTED by poll_id. This is basically a merge intervals problem
        '''
        polls = merge_polls(polls_and_votes)    # This is an array of classes

        output = list(map(lambda poll: poll.dict(), polls))
        
        return output
    
    def get_poll(self, poll_id: int) -> dict:
        poll_and_votes = self.query("""
            SELECT 
                poll.id AS poll_id,
                poll.title,
                poll.description,
                poll.created_at,
                poll.created_by,
                poll_option.id AS option_id,
                poll_option.option,
                poll_vote.voted_by
            FROM 
                poll
            JOIN
                poll_option ON poll.id = poll_option.poll_id
            LEFT JOIN
                poll_vote ON poll_option.id = poll_vote.vote
            WHERE 
                poll.id = %s
            ORDER BY poll.id, poll_option.id;
        """, (poll_id,))

        poll = merge_polls(poll_and_votes)[0].dict()
    
        return poll
    
    def create_poll(self, trip_id, title, description: str | None, creator_email: str) -> int:
        poll_id = self.query("""
            INSERT INTO poll 
                (trip_id, title, description, created_by) 
                VALUES (%s, %s, %s, %s)
            RETURNING id;
        """, (trip_id, title, description, creator_email))[0]['id']

        return poll_id
    
    def create_poll_options(self, poll_id: int, options: list[str]) -> None:
        # This would seem like a good place for a psycopg "executemany", but 
        # the docs say it's not faster than just calling execute on a loop
        for option in options:
            self.query("""
                INSERT INTO poll_option (poll_id, option) VALUES (%s, %s);
            """, (poll_id, option))

    def submit_vote(self, poll_id: int, poll_option_id: int, voter_email: str) -> None:
        self.query("""
                INSERT INTO poll_vote (poll_id, vote, voted_by) VALUES (%s, %s, %s);
            """, (poll_id, poll_option_id, voter_email))

    def delete_poll(self, poll_id: int) -> None:
        self.query("""
            DELETE FROM poll WHERE id=%s;
        """, (poll_id,))

    # --------------- PACKING OPERATIONS --------------- #

    def get_packing_items(self, trip_id: str) -> list[dict]:
        items = self.query("""
            SELECT * FROM packing WHERE trip_id=%s ORDER BY id;
        """, (trip_id,))

        return items
    
    def create_packing_item(self, trip_id: str, item: str, quantity: int, description: str | None, email: str) -> dict:
        new_item = self.query("""
            INSERT INTO packing (trip_id, item, quantity, description, created_by) 
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *;
        """, (trip_id, item, quantity, description, email))[0]

        return new_item

    def claim_packing_item(self, email: str, item_id: int) -> None:
        # Allow a user to claim this item as long as it is not currently claimed
        self.query("""
            UPDATE packing SET packed_by = %s WHERE packed_by IS NULL AND id = %s;
        """, (email, item_id))
                
    def unclaim_packing_item(self, item_id: int) -> None:
        self.query("""
            UPDATE packing SET packed_by = NULL WHERE packed_by IS NOT NULL AND id = %s;
        """, (item_id,))

    def delete_packing_item(self, item_id: int) -> None:
        self.query("""
            DELETE FROM packing WHERE id=%s RETURNING *;
        """, (item_id,))
    
    # --------------- MESSAGE OPERATIONS --------------- #

    def get_messages(self, trip_id: str) -> list[dict]:
        msgs = self.query("""
            SELECT * FROM message WHERE trip_id = %s ORDER BY id;
        """, (trip_id,))

        return msgs
    
    def create_msg(self, trip_id: str, content: str, created_by: str) -> dict:
        db_msg = db_handler.query("""
            INSERT INTO message (
            trip_id, content, created_by          
            ) VALUES (
                %s, %s, %s    
            )
            RETURNING *;
            """, (trip_id, content, created_by))[0]
        
        return db_msg
    
    def delete_messages(self, trip_id: str) -> None:
        self.query("""
            DELETE FROM message WHERE trip_id = %s;
        """, (trip_id,))
    
    # --------------- TRAVELLER OPERATIONS --------------- #

    def get_travellers(self, trip_id: str) -> list[dict]:
        travellers = self.query("""
            SELECT traveller.*, traveller_trip.confirmed, traveller_trip.admin
            FROM traveller 
            JOIN traveller_trip ON traveller.id = traveller_trip.traveller_id
            WHERE traveller_trip.trip_id = %s
            ORDER BY last_name;
            """, (trip_id,))
        
        return travellers

    
    # --------------- DATABASE LIMIT OPERATIONS --------------- #

    def count_users(self) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM traveller;
        """)[0]['count']

        return count

    def count_user_created_trips(self, email: str) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM trip WHERE created_by=%s;
        """, (email,))[0]['count']

        return count
    
    def count_user_trips_attended(self, email: str) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM traveller_trip 
                WHERE traveller_id=(SELECT id FROM traveller WHERE email=%s);
        """, (email,))[0]['count']

        return count

    def count_travellers_on_trip(self, trip_id: str) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM traveller_trip WHERE trip_id=%s
        """, (trip_id,))[0]['count']

        return count
    
    def count_itinerary(self, trip_id) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM itinerary WHERE trip_id=%s;
        """, (trip_id,))[0]['count']

        return count
    
    def count_polls(self, trip_id: str) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM poll WHERE trip_id=%s;
        """, (trip_id,))[0]['count']

        return count
    
    def count_packing(self, trip_id: str) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM packing WHERE trip_id=%s;
        """, (trip_id,))[0]['count']

        return count
    
    def count_messages(self, trip_id: str) -> int:
        count = self.query("""
            SELECT COUNT(*) FROM message WHERE trip_id=%s;
        """, (trip_id,))[0]['count']

        return count
    
# CREATE DATABASE HANDLER
settings = {
    'host': Constants.DB_HOST,
    'port': Constants.DB_PORT,
    'user': Constants.DB_USER,
    'password': Constants.DB_PWD,
    'database': Constants.DB_DBNAME
}

db_handler = PsycopgDatabaseHandler(**settings)
