SHELL := /bin/zsh

BACKEND_DIR := $(CURDIR)/Khubzati-backend-apis
ADMIN_DIR := $(CURDIR)/admin
APP_DIR := $(CURDIR)/khubzati-app

BACKEND_PORT ?= 3000
ADMIN_PORT ?= 3003
API_BASE_URL ?= http://localhost:$(BACKEND_PORT)/v1
API_BASE_URL_ANDROID ?= http://10.0.2.2:$(BACKEND_PORT)/v1
FLUTTER_DEVICE_IOS ?= 0F640259-4616-4B6C-978B-4B7DEFF361D3
FLUTTER_DEVICE_ANDROID ?= emulator-5554
ENABLE_STUB_RESPONSES ?= true
NODE_ENV ?= development

.PHONY: help make-backend-env run-backend run-backend-prod run-admin run-flutter-ios run-flutter-android run-all test-backend postman

help:
	@echo "Available commands:"
	@echo "  make make-backend-env   # Create backend .env from sample.env if missing"
	@echo "  make run-backend        # Run Express API with stubs (ENABLE_STUB_RESPONSES=$(ENABLE_STUB_RESPONSES)) on BACKEND_PORT (default: 3000)"
	@echo "  make run-backend-prod   # Run Express API without stubs (production-like)"
	@echo "  make run-admin          # Run admin app on ADMIN_PORT (default: 3003)"
	@echo "  make run-flutter-ios    # Run Flutter dev flavor on iOS simulator"
	@echo "  make run-flutter-android# Run Flutter dev flavor on Android emulator"
	@echo "  make run-all            # Run backend + admin together"
	@echo "  make test-backend       # Run backend Jest/Supertest tests"
	@echo "  make postman            # Run Postman/Newman suite against local backend"

make-backend-env:
	@if [ -f "$(BACKEND_DIR)/.env" ]; then \
		echo "Backend .env already exists: $(BACKEND_DIR)/.env"; \
	else \
		cp "$(BACKEND_DIR)/sample.env" "$(BACKEND_DIR)/.env"; \
		echo "Created $(BACKEND_DIR)/.env from sample.env"; \
		echo "Update DATABASE_URL and DIRECT_URL before login flows."; \
	fi

run-backend:
	cd "$(BACKEND_DIR)" && APP_PORT=$(BACKEND_PORT) ENABLE_STUB_RESPONSES=$(ENABLE_STUB_RESPONSES) NODE_ENV=$(NODE_ENV) node src/app.js

run-admin:
	cd "$(ADMIN_DIR)" && npx next dev -p $(ADMIN_PORT)

run-flutter-ios:
	cd "$(APP_DIR)" && flutter run --flavor dev --target lib/main_dev.dart --dart-define API_BASE_URL=$(API_BASE_URL) -d $(FLUTTER_DEVICE_IOS)

run-flutter-android:
	cd "$(APP_DIR)" && flutter run --flavor dev --target lib/main_dev.dart --dart-define API_BASE_URL=$(API_BASE_URL_ANDROID) -d $(FLUTTER_DEVICE_ANDROID)

run-all:
	@echo "Starting backend on $(BACKEND_PORT) and admin on $(ADMIN_PORT)..."
	@(cd "$(BACKEND_DIR)" && APP_PORT=$(BACKEND_PORT) ENABLE_STUB_RESPONSES=$(ENABLE_STUB_RESPONSES) NODE_ENV=$(NODE_ENV) node src/app.js) & \
	(cd "$(ADMIN_DIR)" && npx next dev -p $(ADMIN_PORT)) & \
	wait

run-backend-prod:
	cd "$(BACKEND_DIR)" && APP_PORT=$(BACKEND_PORT) ENABLE_STUB_RESPONSES=false NODE_ENV=production node src/app.js

test-backend:
	cd "$(BACKEND_DIR)" && npm test

postman:
	cd "$(BACKEND_DIR)" && npx newman run Khubzati_API.postman_collection.json -e Khubzati_API.postman_environment.json --reporter-cli-summary
