import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  // If remote database is provided (PostgreSQL, MySQL, Turso), use it directly
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // When running on Netlify or AWS Lambda serverless runtime
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      const sourceDb = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(/*turbopackIgnore: true*/ sourceDb)) {
        try {
          fs.copyFileSync(sourceDb, tmpDbPath);
        } catch (e) {
          console.error("Failed to copy database to /tmp from", sourceDb, e);
        }
      } else {
        // Fallback for nested lambda bundlers
        const fallback = path.resolve("./prisma/dev.db");
        if (fs.existsSync(/*turbopackIgnore: true*/ fallback)) {
          try {
            fs.copyFileSync(fallback, tmpDbPath);
          } catch (e) {
            console.error("Failed to copy database from fallback to /tmp:", e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  return undefined;
}

const dbUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (dbUrl
    ? new PrismaClient({
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      })
    : new PrismaClient());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
