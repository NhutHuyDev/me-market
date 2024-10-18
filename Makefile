create-mongo-keyfile:
	openssl rand -base64 756 > ./mongo/mongo-keyfile

mongo: create-mongo-keyfile
	cd ./mongo && docker-compose up -d

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

.PHONY: seed build server dev lint lintfix mongo
