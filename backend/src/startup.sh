#!/bin/bash

# Install requirements
pip install --quiet -r /app/requirements.txt

# Start the FastAPI app with Uvicorn
cd /app/src     # Navigate to the main module directory
uvicorn main:app --reload 
