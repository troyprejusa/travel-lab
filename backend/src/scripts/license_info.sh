#!usr/bin/bash
cd ..
pip-licenses --summary --from=mixed
pip-licenses --from=mixed --format=json > third_party_licenses.json
cd scripts