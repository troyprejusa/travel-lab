#!/usr/bin/bash

echo "You must execute this from inside the container for it to work!"
cd ..
pip freeze > requirements.txt
cd scripts