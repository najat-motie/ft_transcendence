.PHONY: help build up down restart clean logs logs-backend logs-frontend logs-db shell-backend shell-frontend shell-db ps migrate migrate-dev migrate-reset db-push db-seed prune dev stop start rebuild

help:
	@echo "Available commands:"
	@echo "  make build          - Build all Docker containers"
	@echo "  make up             - Start all containers in detached mode"
	@echo "  make down           - Stop and remove all containers"
	@echo "  make restart        - Restart all containers"
	@echo "  make dev            - Start all containers with logs"
	@echo "  make stop           - Stop all containers without removing"
	@echo "  make start          - Start existing containers"
	@echo "  make rebuild        - Rebuild and restart all containers"
	@echo ""
	@echo "  make logs           - Show logs from all containers"
	@echo "  make logs-backend   - Show backend logs"
	@echo "  make logs-frontend  - Show frontend logs"
	@echo "  make logs-db        - Show database logs"
	@echo ""
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make shell-db       - Open PostgreSQL shell"
	@echo ""
	@echo "  make migrate        - Run Prisma migrations"
	@echo "  make migrate-dev    - Create and run new migration"
	@echo "  make migrate-reset  - Reset database and run migrations"
	@echo "  make db-push        - Push schema changes without migration"
	@echo "  make db-seed        - Seed the database"
	@echo ""
	@echo "  make ps             - Show running containers"
	@echo "  make clean          - Stop and remove containers, networks, volumes"
	@echo "  make prune          - Remove all unused Docker resources"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

dev:
	docker compose up

stop:
	docker compose stop

start:
	docker compose start

rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f db

shell-backend:
	docker compose exec backend sh

shell-frontend:
	docker compose exec frontend sh

shell-db:
	docker compose exec db psql -U $(shell grep POSTGRES_USER .env | cut -d '=' -f2) -d $(shell grep POSTGRES_DB .env | cut -d '=' -f2)

ps:
	docker compose ps

migrate:
	docker compose exec backend npx prisma migrate deploy

migrate-dev:
	docker compose exec backend npx prisma migrate dev

migrate-reset:
	docker compose exec backend npx prisma migrate reset

db-push:
	docker compose exec backend npx prisma db push

db-seed:
	docker compose exec backend npx prisma db seed

clean:
	docker compose down -v
	docker system prune -f

prune:
	docker system prune -af
	docker volume prune -f