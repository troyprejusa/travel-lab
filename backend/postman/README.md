# Travel Lab Postman collection

Open `backend` as a local project folder in the Postman desktop app. The `collections/Travel Lab` folder contains a request for every application REST route. The requests use `http://localhost:8000` and the development bearer token `troy@test.com`.

The trip and traveller UUIDs are from the development seed data. Item and poll IDs are examples; replace them with IDs returned by the API. POST, PATCH, and DELETE requests modify data. The delete-user endpoint also calls Auth0.

## Socket.IO

The backend also mounts Socket.IO at `/sio/socket.io`. These are Socket.IO events rather than REST routes and are not represented by the HTTP request files. Connections use a `trip_id` query parameter and an auth payload such as `{"token":"troy@test.com"}`.

| Namespace | Client events |
| --- | --- |
| `/itinerary` | `frontend_itinerary_create`, `frontend_itinerary_delete` |
| `/poll` | `frontend_poll_create`, `frontend_vote`, `frontend_poll_delete` |
| `/packing` | `frontend_packing_create`, `frontend_packing_claim`, `frontend_packing_unclaim`, `frontend_packing_delete` |
| `/message` | `frontend_msg` |

Event payload models are defined in `src/models/schemas.py`; the event handlers are in `src/models/web_socket_handler.py`.
