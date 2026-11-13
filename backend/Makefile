.PHONY: lint licenses db-console

lint:
	uv run --locked --group dev ruff check --fix src tests

test:
	uv run --locked --group dev pytest --cov=src --cov-report=term-missing tests

licenses:
	./scripts/license_info.sh

db-console:
	docker compose exec database_dev psql -U docker -d travel_lab
