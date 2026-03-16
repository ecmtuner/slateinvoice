FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
