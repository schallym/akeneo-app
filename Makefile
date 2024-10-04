DOCKER = docker
DOCKER_COMPOSE = docker compose
NPM = $(DOCKER_COMPOSE) exec node npm run

.DEFAULT_GOAL := help
help:
	@echo "⚠️  Caution: those targets are written for dev environement."
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

# Docker
build: ## Build the app
	$(DOCKER_COMPOSE) build --no-cache

up: ## Start the app
	$(DOCKER_COMPOSE) up -d --wait

stop: ## Stop the app
	$(DOCKER_COMPOSE) stop

restart: stop up ## Restart the app

logs: ## Tail logs on node container
	$(DOCKER_COMPOSE) logs -f --tail 300 node

sh: ## Connect to node container
	$(DOCKER_COMPOSE) exec node bash

sync: ## Sync the app files
	$(DOCKER) cp akeneo-app-node-1:/app/node_modules .

# App
build-app: ## Build the app in dist folder
	$(NPM) build

# Quality
lint: ## Lint the code
	$(NPM) lint

# Dependencies
update-dependencies: ## Update the dependencies
	$(DOCKER_COMPOSE) exec node npm update

# Tests
tests: ## Run the tests
	$(NPM) test

tests-cov: ## Run the tests with coverage
	$(NPM) test:cov

# Database
db-schema-update: ## Update the database schema
	$(DOCKER_COMPOSE) exec node npx prisma db push

# Dev
ngrok: ## Start ngrok
	ngrok http 3000

