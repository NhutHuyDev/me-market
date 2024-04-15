FROM node:20-alpine

WORKDIR /usr/src/express-app

COPY package*.json ./
RUN npm ci
    
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 8080
CMD [ "npm","start"]

