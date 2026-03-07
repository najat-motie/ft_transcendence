FROM node:latest

WORKDIR /app

COPY package*.json /app

RUN npm i

COPY . /app

RUN npx prisma generate

CMD [ "node" , "src/server.js" ]