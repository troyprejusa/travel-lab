#!/bin/bash

# Install requirements
pip install --quiet -r /app/requirements.txt

# Start the FastAPI app with Uvicorn
cd /app/src     # Navigate to the main module directory

# With debug server
python -m debugpy --listen 0.0.0.0:5678 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level warning

# No debugger
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level warning
