.PHONY: lint test licenses db-console db-setup db-reset db-seed

DB_HOST ?= localhost

lint:
	uv run --locked --group dev ruff check --fix src tests

test:
	MODE=test uv run --env-file .env.test --locked --group dev pytest --cov=src --cov-report=term-missing tests

licenses:
	./scripts/license_info.sh

db-console:
	docker compose exec database_dev psql -U docker -d travel_lab

db-setup:
	DB_HOST="$(DB_HOST)" uv run --locked alembic upgrade head

db-reset:
	DB_HOST="$(DB_HOST)" uv run --locked alembic downgrade base
	DB_HOST="$(DB_HOST)" uv run --locked alembic upgrade head

db-seed:
	DB_HOST="$(DB_HOST)" uv run --locked python src/db_seed.py
