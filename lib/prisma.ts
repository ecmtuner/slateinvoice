import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function makePrisma() {
  const dbPath = path.join(process.cwd(), "invoicebuddy.db");
  const sqlite = new Database(dbPath) as unknown as ConstructorParameters<typeof PrismaBetterSqlite3>[0];
  const adapter = new PrismaBetterSqlite3(sqlite);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? makePrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
