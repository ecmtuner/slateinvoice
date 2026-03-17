#!/bin/sh
echo "=== SlateInvoice Starting ==="
echo "PORT=${PORT}"
echo "DATABASE_URL prefix=$(echo $DATABASE_URL | cut -c1-25)"

echo "Running prisma db push..."
./node_modules/.bin/prisma db push --accept-data-loss
echo "DB push exit code: $?"

echo "Starting Next.js on port ${PORT}..."
exec ./node_modules/.bin/next start -p ${PORT}
