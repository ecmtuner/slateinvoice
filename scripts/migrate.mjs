// Run with: DATABASE_URL=<url> node scripts/migrate.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Running migrations...");

  // Stripe Connect fields on User
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;
  `);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeAccountStatus" TEXT DEFAULT 'not_connected';
  `);

  console.log("Migrations complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
