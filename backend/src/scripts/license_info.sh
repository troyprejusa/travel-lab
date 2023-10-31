#!usr/bin/bash

echo "You must execute this from inside the container for it to work!"

cd ..
pip-licenses --summary --from=mixed
pip-licenses --from=mixed --format=json > third_party_licenses.json
cd scripts