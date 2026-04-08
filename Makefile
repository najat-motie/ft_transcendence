.PHONY: help build up down restart clean clean-all logs logs-backend logs-frontend logs-db shell-backend shell-frontend shell-db ps migrate migrate-dev migrate-reset db-push db-seed prune dev stop start rebuild

export DOCKER_CONFIG := $(PWD)/.docker
COMPOSE := docker compose -p ft_transcendence -f infra/docker-compose.yml --env-file .env

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
	@echo "  make prune          - Remove all unused Docker resources"
	@echo "  make clean          - Stop and remove containers, networks, volumes"
	@echo "  make clean-all      - Remove all Docker resources (⚠️ this will delete resources from ALL projects)"

build:
	@$(COMPOSE) build

up:
	@$(COMPOSE) up -d

dev:
	@$(COMPOSE) up

down:
	@$(COMPOSE) down

stop:
	@$(COMPOSE) stop

start:
	@$(COMPOSE) start

restart:
	@$(COMPOSE) restart

rebuild: down
	@$(COMPOSE) build --no-cache
	@$(COMPOSE) up -d

prune:
	@docker system prune -af
	@docker volume prune -f
	
clean:
	@$(COMPOSE) down -v --rmi all --remove-orphans
	@docker system prune -f

clean-all:
	-@docker compose down -v --remove-orphans 2>/dev/null || true
	-@docker rm -f $$(docker ps -aq) 2>/dev/null || true
	-@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	-@docker network prune -f 2>/dev/null || true
	-@docker image prune -a -f 2>/dev/null || true

logs:
	@$(COMPOSE) logs -f

ps:
	@$(COMPOSE) ps

logs-backend:
	@$(COMPOSE) logs -f backend

logs-frontend:
	@$(COMPOSE) logs -f frontend

logs-db:
	@$(COMPOSE) logs -f db

shell-backend:
	$(COMPOSE) exec backend sh

shell-frontend:
	@$(COMPOSE) exec frontend sh

shell-db:
	@$(COMPOSE) exec db psql -U $(shell grep POSTGRES_USER .env | cut -d '=' -f2) -d $(shell grep POSTGRES_DB .env | cut -d '=' -f2)

migrate:
	@$(COMPOSE) exec backend npx prisma migrate deploy

migrate-dev:
	@$(COMPOSE) exec backend npx prisma migrate dev

migrate-reset:
	@$(COMPOSE) exec backend npx prisma migrate reset

db-push:
	@$(COMPOSE) exec backend npx prisma db push

db-seed:
	@$(COMPOSE) exec backend npx prisma db seed
