import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function setupDatabase(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  // If remote database is provided (PostgreSQL, MySQL, Turso), use it directly
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // When running on Netlify or AWS Lambda serverless runtime
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), ".next", "server", "prisma", "dev.db"),
        path.resolve("./prisma/dev.db"),
        path.resolve("./dev.db"),
        "/var/task/prisma/dev.db",
        "/var/task/.next/server/prisma/dev.db",
      ];

      for (const candidate of candidates) {
        try {
          if (fs.existsSync(candidate)) {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          }
        } catch (_) {}
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      const resolvedUrl = `file:${tmpDbPath}`;
      process.env.DATABASE_URL = resolvedUrl;
      return resolvedUrl;
    }
  }

  // Ensure process.env.DATABASE_URL is always set to avoid initialization errors
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }

  return process.env.DATABASE_URL;
}

const dbUrl = setupDatabase();

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
