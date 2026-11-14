from abc import ABC, abstractmethod
from datetime import date


class DatabaseHandler(ABC):
    """Database operations used by the application."""

    @abstractmethod
    async def open(self) -> None:
        ...

    @abstractmethod
    async def close(self) -> None:
        ...

    @abstractmethod
    async def query(self, query: str, params: None | tuple | dict=None) -> None | list[dict]:
        ...

    @abstractmethod
    async def get_user(self, email: str) -> dict | None:
        ...

    @abstractmethod
    async def create_user(self, email: str) -> dict:
        ...

    @abstractmethod
    async def patch_user_info(self, first_name: str, last_name: str, phone: str, email: str) -> None:
        ...

    @abstractmethod
    async def delete_user(self, email: str) -> None:
        ...

    @abstractmethod
    async def get_trips(self, email: str) -> list[dict]:
        ...

    @abstractmethod
    async def get_user_trip_attendance(self, email: str) -> list[dict]:
        """Return confirmed trip IDs and admin flags for a user."""
        ...

    @abstractmethod
    async def leave_trip(self, email: str, trip_id: str) -> None:
        ...

    @abstractmethod
    async def request_trip(self, email: str, trip_id: str) -> None:
        ...

    @abstractmethod
    async def accept_request(self, requestor_id, trip_id) -> None:
        ...

    @abstractmethod
    async def remove_traveller(self, traveller_id: str, trip_id: str) -> None:
        ...

    @abstractmethod
    async def create_trip(self, destination: str, description: str, start_date: date, end_date: date, vacation_type: str, email: str) -> str:
        ...

    @abstractmethod
    async def get_trip_data(self, trip_id: str) -> dict:
        ...

    @abstractmethod
    async def get_trip_permissions(self, trip_id: str, email: str) -> dict:
        ...

    @abstractmethod
    async def delete_trip(self, trip_id: str) -> dict:
        ...

    @abstractmethod
    async def get_itinerary(self, trip_id: str) -> list[dict]:
        ...

    @abstractmethod
    async def create_itinerary(self, trip_id: str, title: str, description: str | None, start_time: str, end_time: str, email: str) -> dict:
        ...

    @abstractmethod
    async def delete_itinerary(self, stop_id: int) -> None:
        ...

    @abstractmethod
    async def get_polls(self, trip_id: str) -> list[dict]:
        ...

    @abstractmethod
    async def get_poll(self, poll_id: int) -> dict:
        ...

    @abstractmethod
    async def create_poll(self, trip_id, title, description: str | None, creator_email: str) -> int:
        ...

    @abstractmethod
    async def create_poll_options(self, poll_id: int, options: list[str]) -> None:
        ...

    @abstractmethod
    async def submit_vote(self, poll_id: int, poll_option_id: int, voter_email: str) -> None:
        ...

    @abstractmethod
    async def delete_poll(self, poll_id: int) -> None:
        ...

    @abstractmethod
    async def get_packing_items(self, trip_id: str) -> list[dict]:
        ...

    @abstractmethod
    async def create_packing_item(self, trip_id: str, item: str, quantity: int, description: str | None, email: str) -> dict:
        ...

    @abstractmethod
    async def claim_packing_item(self, email: str, item_id: int) -> None:
        ...

    @abstractmethod
    async def unclaim_packing_item(self, item_id: int) -> None:
        ...

    @abstractmethod
    async def delete_packing_item(self, item_id: int) -> None:
        ...

    @abstractmethod
    async def get_messages(self, trip_id: str) -> list[dict]:
        ...

    @abstractmethod
    async def create_msg(self, trip_id: str, content: str, created_by: str) -> dict:
        ...

    @abstractmethod
    async def delete_messages(self, trip_id: str) -> None:
        ...

    @abstractmethod
    async def get_travellers(self, trip_id: str) -> list[dict]:
        ...

    @abstractmethod
    async def count_users(self) -> int:
        ...

    @abstractmethod
    async def count_user_created_trips(self, email: str) -> int:
        ...

    @abstractmethod
    async def count_user_trips_attended(self, email: str) -> int:
        ...

    @abstractmethod
    async def count_travellers_on_trip(self, trip_id: str) -> int:
        ...

    @abstractmethod
    async def count_itinerary(self, trip_id) -> int:
        ...

    @abstractmethod
    async def count_polls(self, trip_id: str) -> int:
        ...

    @abstractmethod
    async def count_packing(self, trip_id: str) -> int:
        ...

    @abstractmethod
    async def count_messages(self, trip_id: str) -> int:
        ...
