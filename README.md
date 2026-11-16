<div align="center">
    <img src="design/travel-lab-logo-gpt.PNG" height=250>
</div>

# Troys Travel Lab

## Overview

> **Note**: The deployed application is in closed alpha release, so the general public will not be able to create an account at this time. Access to the site is invite-only by the author.

Troy's Travel Lab is a collaborative travel planning app. It was created out of a frustration with the process
of planning trips with friends. Time and time again, we would create
shared calendars to track events, spreadsheets to jot down important
details, and message threads to stay in communcation regarding the
details. Troy's Travel Lab is my way of bringing these resources
together to plan a trip all in one place.

### Tech Stack

#### Frontend

- React and TypeScript
- Vite
- Tailwind CSS and shadcn/ui

#### Backend

- Python
- FastAPI
- PostgreSQL | Pyscopg
- Python Socket.io Server
- Auth0 Python SDK

#### Development

- Vite
- Docker Compose

## Running Development Mode

### Environment Variables

Backend configuration is documented in `backend/src/utilities/constants.py`. The new frontend scaffold does not require environment variables.

### Network Hosts

In the code you will notice some references to travel-lab.dev. This was a development alias to localhost, which was necessary for Auth0 because it does not allow its redirect URLs to be "localhost". Thefore, be sure to add the below line to your /etc/hosts file.

```
127.0.0.1       travel-lab.dev
```

### Containers and Services

The Docker compose file starts the FastAPI development server and Postgres:

1. Python - FastAPI app with code mounted in via volume and reload on save enabled
2. Postgres - Development SQL database

Run Vite locally outside Docker to serve the frontend over HTTP with hot module reloading. FastAPI serves API requests and can also serve the built frontend when needed.

### Starting Development Mode
From the repository root, run `docker compose -f backend/docker-compose.yaml up` to start the API and dev database.

- If you are going to use the Vite dev server to serve the application, open another terminal, run `cd frontend`, then `npm install` and `npm run dev`
- If you are going to use the FastAPI app to serve the application, from the `/frontend` folder run `npm run build`. The built bundle is volume-mounted into the container so it will be available to be served immediately.

The Vite development server runs on HTTP at `http://localhost:5173` by default. It forwards `/dev` and `/api/v1` requests and `/sio` WebSocket traffic to `http://localhost:8000`. To add a shadcn/ui component, run `npx shadcn@latest add <component>` from `frontend`.
