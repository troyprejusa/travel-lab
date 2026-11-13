#!/bin/bash

# Install the locked project dependencies from the backend project root
cd /app
uv sync --locked --no-dev

# Start the FastAPI app with Uvicorn
cd /app/src
# With debug server
uv run --project /app --no-sync python -m debugpy --listen 0.0.0.0:5678 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level warning

