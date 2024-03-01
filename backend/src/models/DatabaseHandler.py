import psycopg
from psycopg_pool import AsyncConnectionPool
from utilities import Constants
from utilities.merge_polls import merge_polls
from datetime import date
from .ModelsLogger import models_logger
from uuid import UUID


class PsycopgDatabaseHandler:
    """
    Abstracting the database querying functionality into this class so that it
    can more easily be replaced with other means if desired
    """
    def __init__(self, host: str, port: str, user: str, password: str, database: str) -> None:
        connection_string = f"host={host} port={port} user={user} password={password} dbname={database}"
        self.pool = AsyncConnectionPool(connection_string, max_size=Constants.DB_CONN_LIMIT)


    '''
    Wrap the cursor.execute method as to open and close a cursor,
    print the executed query, and report its success/failure
    Still throw an error, as the caller needs to know if the
    query failed
    '''
    async def query(self, query: str, params: None | tuple | dict = None) -> None | list[dict]:
        # Use connection context manager for autocommit/rollback
        async with self.pool.connection() as connection:
            # Use cursor context manager to automatically close cursor
            async with connection.cursor(row_factory=psycopg.rows.dict_row) as cursor:
                try:
                    if params is not None:
                        await cursor.execute(query, params)
                    else:
                        await cursor.execute(query)
                    
                    data = await cursor.fetchall()

                    PsycopgDatabaseHandler.convert_uuid_to_string(data)

                    return data
                    
                except psycopg.ProgrammingError:
                    '''
                    This is a psycopg.DatabaseError, and is needed because 
                    executing fetchall() on psql statements that do not
                    explicitly return anything (CREATE, DROP, INSERT, 
                    UPDATE, DELETE, etc.) will throw an error
                    '''
                    return None

                except psycopg.Error as pg_error:
                    models_logger.debug(f'Query failure:\n{cursor.query}')
                    raise pg_error
                
    @staticmethod
    def convert_uuid_to_string(list_of_dicts: list[dict]):
        for item in list_of_dicts:
            for key, val in item.items():
                if isinstance(val, UUID):
                    item[key] = str(val)

                
    # ------------------- USER OPERATIONS ------------------- #

    async def get_user(self, email: str) -> dict | None:
        user = await self.query("""
            SELECT * FROM traveller where email = %s;
        """, (email,))

        if len(user) == 0:
            return None
        else:
            return user[0]
        
    async def create_user(self, email: str) -> dict:
        user = await self.query("""
            INSERT INTO traveller (email) VALUES (%s)
            RETURNING *;
        """, (email,))

        return user[0]
                
    # async def upsert_user(self, email: str) -> dict:
    #     user = await self.query("""
    #         INSERT INTO traveller (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;
    #         SELECT * FROM traveller WHERE email=%s;
    #     """, (email, email))

    #     return user[0]
    
    async def patch_user_info(self, first_name: str, last_name: str, phone: str, email: str) -> None:
        updated_user = await self.query("""
            UPDATE traveller SET first_name=%s, last_name=%s, phone=%s
            WHERE email=%s
            RETURNING *;
        """, (first_name, last_name, phone, email))
        
        return updated_user[0]
    
    async def delete_user(self, email: str) -> None:
        await self.query("DELETE FROM traveller WHERE email=%s;", (email,))

    async def get_trips(self, email: str) -> list[dict]:
        data = await self.query("""
            SELECT * FROM trip WHERE id in (
                SELECT trip_id FROM traveller_trip WHERE 
                    confirmed = TRUE AND 
                    traveller_id = (
                    SELECT id FROM traveller WHERE email = %s
                )
            );
        """, (email,))

        return data
    
    async def leave_trip(self, email: str, trip_id: str) -> None:
        await self.query("""
            DELETE FROM traveller_trip WHERE traveller_id = (SELECT id from traveller WHERE email=%s) AND trip_id=%s;
        """, (email, trip_id))
    
    async def request_trip(self, email: str, trip_id: str) -> None:
        await self.query("""
            INSERT INTO traveller_trip VALUES ((SELECT id from traveller where email=%s), %s, False, False);
        """, (email, trip_id))

    async def accept_request(self, requestor_id, trip_id) -> None:
        await self.query("""
            UPDATE traveller_trip SET confirmed=TRUE WHERE traveller_id=%s AND trip_id=%s;
        """, (requestor_id, trip_id))

    async def remove_traveller(self, traveller_id: str, trip_id: str) -> None:
        await self.query("""
            DELETE FROM traveller_trip WHERE traveller_id=%s AND trip_id=%s;
        """, (traveller_id, trip_id))

    # --------------- TRIP OPERATIONS --------------- #

    async def create_trip(self, destination: str, description: str, start_date: date, end_date: date, vacation_type: str, email: str) -> str:
        # This call must not only create the trip, but must add
        # this user to the trip in the same transaction so there
        # are no dangling trips
        new_trip_id = await self.query("""
            WITH temp_table as (
                INSERT INTO trip 
                (destination, description, start_date, end_date, vacation_type, created_by)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            ) INSERT INTO traveller_trip VALUES ((SELECT id FROM traveller WHERE email=%s), (SELECT id from temp_table), TRUE, TRUE) RETURNING trip_id;
        """, (destination, description, start_date, end_date, vacation_type, email, email))

        return new_trip_id[0]['trip_id']

    async def get_trip_data(self, trip_id: str) -> dict:
        trip = await self.query("""
            SELECT * FROM trip WHERE id=%s ORDER BY start_date;
        """, (trip_id,))

        return trip[0]
    
    async def get_trip_permissions(self, trip_id: str, email: str) -> dict:
        permissions = await self.query("""
            SELECT confirmed, admin 
            FROM traveller_trip 
            WHERE trip_id=%s AND 
            traveller_id=(SELECT id FROM traveller WHERE email=%s);
        """, (trip_id, email))

        return permissions[0]

    async def delete_trip(self, trip_id: str) -> dict:
        deleted_trip = await self.query("""
            DELETE FROM trip WHERE id = %s RETURNING *;
        """, (trip_id,))
        
        return deleted_trip[0]
    
    # --------------- ITINERARY OPERATIONS --------------- #

    async def get_itinerary(self, trip_id: str) -> list[dict]:
        itinerary = await self.query("""
            SELECT * FROM itinerary WHERE trip_id = %s ORDER BY start_time;
        """, (trip_id,))

        return itinerary
    
    async def create_itinerary(self, trip_id: str, title: str, description: str | None, start_time: str, end_time: str, email: str) -> dict:
        new_stop = await self.query("""
            INSERT INTO itinerary (trip_id, title, description, start_time, end_time, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *;
        """, (trip_id, title, description, start_time, end_time, email))

        return new_stop[0]

    async def delete_itinerary(self, stop_id: int) -> None:
        await self.query("""
            DELETE FROM itinerary WHERE id=%s;
        """, (stop_id,))

    # --------------- POLL OPERATIONS --------------- #

    async def get_polls(self, trip_id: str) -> list[dict]:
        '''
        The results for one poll on this trip will have the following number
        of rows:
        M options * N people who voted this option, M >= 1 & N >= 1
        Repeat this for P polls. It's kind of a mess to sort through, 
        but at least we get everything we need out of 1 query.
        '''
        polls_and_votes = await self.query("""
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
    
    async def get_poll(self, poll_id: int) -> dict:
        poll_and_votes = await self.query("""
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
    
    async def create_poll(self, trip_id, title, description: str | None, creator_email: str) -> int:
        poll_id = await self.query("""
            INSERT INTO poll 
                (trip_id, title, description, created_by) 
                VALUES (%s, %s, %s, %s)
            RETURNING id;
        """, (trip_id, title, description, creator_email))

        return poll_id[0]['id']
    
    async def create_poll_options(self, poll_id: int, options: list[str]) -> None:
        # This would seem like a good place for a psycopg "executemany", but 
        # the docs say it's not faster than just calling execute on a loop
        for option in options:
            await self.query("""
                INSERT INTO poll_option (poll_id, option) VALUES (%s, %s);
            """, (poll_id, option))

    async def submit_vote(self, poll_id: int, poll_option_id: int, voter_email: str) -> None:
        await self.query("""
                INSERT INTO poll_vote (poll_id, vote, voted_by) VALUES (%s, %s, %s);
            """, (poll_id, poll_option_id, voter_email))

    async def delete_poll(self, poll_id: int) -> None:
        await self.query("""
            DELETE FROM poll WHERE id=%s;
        """, (poll_id,))

    # --------------- PACKING OPERATIONS --------------- #

    async def get_packing_items(self, trip_id: str) -> list[dict]:
        items = await self.query("""
            SELECT * FROM packing WHERE trip_id=%s ORDER BY id;
        """, (trip_id,))

        return items
    
    async def create_packing_item(self, trip_id: str, item: str, quantity: int, description: str | None, email: str) -> dict:
        new_item = await self.query("""
            INSERT INTO packing (trip_id, item, quantity, description, created_by) 
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *;
        """, (trip_id, item, quantity, description, email))

        return new_item[0]

    async def claim_packing_item(self, email: str, item_id: int) -> None:
        # Allow a user to claim this item as long as it is not currently claimed
        await self.query("""
            UPDATE packing SET packed_by = %s WHERE packed_by IS NULL AND id = %s;
        """, (email, item_id))
                
    async def unclaim_packing_item(self, item_id: int) -> None:
        await self.query("""
            UPDATE packing SET packed_by = NULL WHERE packed_by IS NOT NULL AND id = %s;
        """, (item_id,))

    async def delete_packing_item(self, item_id: int) -> None:
        await self.query("""
            DELETE FROM packing WHERE id=%s RETURNING *;
        """, (item_id,))
    
    # --------------- MESSAGE OPERATIONS --------------- #

    async def get_messages(self, trip_id: str) -> list[dict]:
        msgs = await self.query("""
            SELECT * FROM message WHERE trip_id = %s ORDER BY id;
        """, (trip_id,))

        return msgs
    
    async def create_msg(self, trip_id: str, content: str, created_by: str) -> dict:
        db_msg = await self.query("""
            INSERT INTO message (
            trip_id, content, created_by          
            ) VALUES (
                %s, %s, %s    
            )
            RETURNING *;
            """, (trip_id, content, created_by))
        
        return db_msg[0]
    
    async def delete_messages(self, trip_id: str) -> None:
        await self.query("""
            DELETE FROM message WHERE trip_id = %s;
        """, (trip_id,))
    
    # --------------- TRAVELLER OPERATIONS --------------- #

    async def get_travellers(self, trip_id: str) -> list[dict]:
        travellers = await self.query("""
            SELECT traveller.*, traveller_trip.confirmed, traveller_trip.admin
            FROM traveller 
            JOIN traveller_trip ON traveller.id = traveller_trip.traveller_id
            WHERE traveller_trip.trip_id = %s
            ORDER BY last_name;
            """, (trip_id,))
        
        return travellers

    
    # --------------- DATABASE LIMIT OPERATIONS --------------- #

    async def count_users(self) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM traveller;
        """)

        return result[0]['count']

    async def count_user_created_trips(self, email: str) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM trip WHERE created_by=%s;
        """, (email,))

        return result[0]['count']
    
    async def count_user_trips_attended(self, email: str) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM traveller_trip 
                WHERE traveller_id=(SELECT id FROM traveller WHERE email=%s);
        """, (email,))

        return result[0]['count']

    async def count_travellers_on_trip(self, trip_id: str) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM traveller_trip WHERE trip_id=%s
        """, (trip_id,))

        return result[0]['count']
    
    async def count_itinerary(self, trip_id) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM itinerary WHERE trip_id=%s;
        """, (trip_id,))

        return result[0]['count']
    
    async def count_polls(self, trip_id: str) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM poll WHERE trip_id=%s;
        """, (trip_id,))

        return result[0]['count']
    
    async def count_packing(self, trip_id: str) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM packing WHERE trip_id=%s;
        """, (trip_id,))

        return result[0]['count']
    
    async def count_messages(self, trip_id: str) -> int:
        result = await self.query("""
            SELECT COUNT(*) FROM message WHERE trip_id=%s;
        """, (trip_id,))

        return result[0]['count']

    
# CREATE DATABASE HANDLER
settings = {
    'host': Constants.DB_HOST,
    'port': Constants.DB_PORT,
    'user': Constants.DB_USER,
    'password': Constants.DB_PWD,
    'database': Constants.DB_DBNAME
}

db_handler = PsycopgDatabaseHandler(**settings)
