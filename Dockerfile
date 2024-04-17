FROM node:20-alpine

WORKDIR /usr/src/memarket-app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8080
CMD [ "npm","start"]

