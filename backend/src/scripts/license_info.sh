#!usr/bin/bash

original_dir=$(pwd)

cd "$(dirname ${BASH_SOURCE})"
cd ..
pip-licenses --summary --from=mixed
pip-licenses --from=mixed --format=json --with-license-file --no-license-path --with-notice-file > third_party_licenses.json

cd "$original_dir"