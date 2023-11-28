<div align="center">
    <img src="frontend/src/assets/src/Travel-Lab-DALL-E.png" height=250>
</div>

# Troys Travel Lab

## Overview

https://troys-travel-lab-19b56a64fe24.herokuapp.com

> **Note**: The deployed application is in closed alpha release, so the general public will not be able to create an account at this time. Access to the site is invite-only by the author.

Troy's Travel Lab is a collaborative travel planning app. It was created out of a frustration with the process
of planning trips with friends. Time and time again, we would create
shared calendars to track events, spreadsheets to jot down important
details, and message threads to stay in communcation regarding the
details. Troy's Travel Lab is my way of bringing these resources
together to plan a trip all in one place.

### Tech Stack

#### Frontend

- TypeScript
- React | React Router
- Redux Toolkit | Thunks
- Socket.io Client
- Auth0 React SPA SDK
- Chakra-UI

#### Backend

- Python
- FastAPI
- PostgreSQL | Pyscopg2
- Python Socket.io Server
- Auth0 Python SDK

#### Development

- Vite
- Docker Compose
- Nginx

## Running Development Mode

### Environment Variables

In development, .env files are used to set all necessary environment variables. In both the React application and the FastAPI application, all loading of environment variables is done in a Constants module, which is then utilized across the application. Therefore, you can find the necessary environment variables necessary in the following files:

```
// Frontend:
frontend/src/utilities/Constants.ts

# Backend:
backend/src/utilities/Constants.py
```

### Network Hosts

In the code you will notice some references to travel-lab.dev. This was a development alias to localhost, which was necessary for Auth0 because it does not allow its redirect URLs to be "localhost". Thefore, be sure to add the below line to your /etc/hosts file.

```
127.0.0.1       travel-lab.dev
```

### Containers and Services

The Docker compose file will start 3 containers, at least of 2 of which are required:

1. Python - FastAPI app with code mounted in via volume and reload on save enabled
2. Postgres - Development SQL database
3. Nginx - Required for SSL termination if the FastAPI application is serving the webpage.

Development mode can take either of 2 forms:

1. Use Vite dev server to serve the application and terminate SSL. This, of course, comes with the extra feature of hot module reloading. Nginx is not used in this mode, but the ports have been deconflicted so there is no harm in having the Nginx container running.
2. Let the FastAPI application serve the page. This will require the Nginx container.

   Important!
   Be sure to modify the `vite.config.ts`, `nginx.conf`, and `docker-compose.yaml` file as needed to use the right paths for volume mounts, certificates, etc. for your machine.

### Starting Development Mode
Open one terminal and enter command `docker compose up` to start the API, dev database, and Nginx.

- If you are going to use the Vite dev server to serve the application, open another terminal and enter command `npm run dev`
- If you are going to use the FastAPI app to serve the application, from the /frontend folder do an `npm build` with the **deployment** environment variable set to **"local"**. The built bundle is volume-mounted into the container so it will be available to be served immediately. 