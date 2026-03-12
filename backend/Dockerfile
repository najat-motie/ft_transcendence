FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json /app

RUN npm i

COPY . /app

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
