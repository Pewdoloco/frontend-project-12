install:
	npm ci
	cd frontend && npm ci

build:
	git config --global --add safe.directory /project/code
	rm -rf frontend/dist
	cd frontend && \
	npm ci && \
	npm run build

start:
	npx start-server -s ./frontend/dist