#!usr/bin/bash

echo "WARNING: You must execute this script from inside the container for it to work correctly!"
cd /app/src
pip-licenses --summary --from=mixed > third_party_license_summary.txt
pip-licenses --from=mixed --format=json --with-license-file --no-license-path --with-notice-file > third_party_licenses.json
