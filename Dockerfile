FROM node:20-alpine

WORKDIR /usr/src/memarketbe

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080
CMD [ "npm","start"]

