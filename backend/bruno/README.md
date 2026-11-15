# Travel Lab Bruno collection

In Bruno, choose **Open Collection** and select the `backend/bruno` folder. Select the **Local** environment, then send **Health Check** with the backend running.

The Local environment contains the development URL, the seeded user's token, a seeded trip and traveller ID, and example item and poll IDs. Change these values as needed. POST, PATCH, and DELETE requests can modify development data; deleting a user also calls Auth0.

The collection covers the REST API. The backend also exposes Socket.IO namespaces at `/sio/socket.io`; their events and payloads are defined in `src/models/web_socket_handler.py` and `src/models/schemas.py`.
