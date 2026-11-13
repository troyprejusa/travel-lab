#!/usr/bin/env bash

set -euo pipefail

BACKEND_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BACKEND_ROOT"
uv run --project "$BACKEND_ROOT" pip-licenses --summary --from=mixed > third_party_license_summary.txt
uv run --project "$BACKEND_ROOT" pip-licenses --from=mixed --format=json --with-license-file --no-license-path --with-notice-file > third_party_licenses.json
