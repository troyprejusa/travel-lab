#!usr/bin/bash

cd ..
pip-licenses --summary --from=mixed
pip-licenses --from=mixed --format=json --with-license-file --no-license-path --with-notice-file > third_party_licenses.json
cd scripts