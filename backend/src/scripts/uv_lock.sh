#!/usr/bin/env bash

echo "Refreshing uv.lock from the backend project directory."
cd "$(dirname "$0")/../.."
uv lock
