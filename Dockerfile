FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

RUN ls node_modules/.bin/prisma && node_modules/.bin/prisma generate

RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
