#!/usr/bin/bash
echo "WARNING: You must execute this script from inside the container for it to work correctly!"

original_dir=$(pwd)

cd "$(dirname ${BASH_SOURCE})"
cd ..
pip freeze > requirements.txt

cd "$original_dir"