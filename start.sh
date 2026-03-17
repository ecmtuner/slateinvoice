#!/bin/sh
set -e
echo "Starting SlateInvoice..."
echo "DATABASE_URL is set: $(echo $DATABASE_URL | cut -c1-20)..."

echo "Running prisma db push..."
./node_modules/.bin/prisma db push --accept-data-loss && echo "DB push OK" || echo "DB push failed, continuing..."

echo "Starting Next.js on port ${PORT:-3000}..."
exec node_modules/.bin/next start -p ${PORT:-3000}
