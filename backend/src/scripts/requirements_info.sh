#!/usr/bin/bash

echo "WARNING: You must execute this script from inside the container for it to work correctly!"
cd /app/src
pip freeze > requirements.txt
