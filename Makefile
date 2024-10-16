mongo:
	docker run --name memarketmongo -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=secret -p 27017:27017 -d mongo

seed:
	npx rimraf dist && npx swc ./src -d ./dist && node ./dist/src/seed/seeder.js

build:
	npm run build

server:
	npm run start

dev:
	npm run dev

lint:
	npm run lint

lintfix:
	npm run lint:fix

.PHONY: mongo seed build server dev lint lintfix
