FROM node:20-alpine

WORKDIR /usr/src/memarket-app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

COPY ./src/templates/*.html ./dist/src/templates/

EXPOSE 8080
CMD [ "npm","start"]

