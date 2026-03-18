import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// Configuração defensiva de ENV para scripts e Turbopack
function getEnv(key: string): string {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key] as string;
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const [k, ...v] = line.split('=');
        if (k.trim() === key) {
          return v.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch {}
  return "";
}

const connectionString = getEnv("DATABASE_URL");

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not defined! Check your .env files.");
}

let adapter: any;

if (connectionString.startsWith("file:") || connectionString.endsWith(".db")) {
  const dbPath = connectionString.replace("file:", "");
  let absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
  
  if (!fs.existsSync(absolutePath) && dbPath.includes("prisma/")) {
      const rootPath = path.join(process.cwd(), dbPath.replace("prisma/", ""));
      if (fs.existsSync(rootPath)) {
          absolutePath = rootPath;
      }
  }

  const sqlite = new Database(absolutePath);
  adapter = new PrismaBetterSqlite3(sqlite as any);
} else {
  const pool = new pg.Pool({ connectionString });
  adapter = new PrismaPg(pool as any);
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const basePrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

export const prisma = basePrisma.$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.password && !args.data.password.startsWith("$2b$")) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data.password && typeof args.data.password === 'string' && !args.data.password.startsWith("$2b$")) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
    },
  },
}) as unknown as PrismaClient;
