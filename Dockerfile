FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY prisma ./prisma/

RUN DATABASE_URL="postgresql://x:x@localhost/x" ./node_modules/.bin/prisma generate

COPY . .

RUN NEXTAUTH_SECRET="buildsecret" NEXTAUTH_URL="http://localhost:3000" npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && npm run start"]
