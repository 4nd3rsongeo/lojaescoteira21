import { createClient } from "@libsql/client";
import fs from 'fs';
import path from 'path';

function getEnv(key: string): string {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      const match = envFile.match(new RegExp(`${key}=\"?(.*?)\"?(\\s|$)`));
      return match ? match[1] : "";
    }
  } catch {}
  return "";
}

const dbUrl = getEnv("TURSO_DATABASE_URL");
const dbKey = getEnv("TURSO_AUTH_TOKEN");

const libsql = createClient({
  url: dbUrl,
  authToken: dbKey,
});

async function main() {
  console.log(`🔨 Criando tabelas manualmente no Turso...`);

  const queries = [
    `CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'USER' NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Product (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0 NOT NULL,
      category TEXT,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS Sale (
      id TEXT PRIMARY KEY,
      total REAL NOT NULL,
      userId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id)
    )`,
    `CREATE TABLE IF NOT EXISTS SaleItem (
      id TEXT PRIMARY KEY,
      saleId TEXT NOT NULL,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL NOT NULL,
      FOREIGN KEY (saleId) REFERENCES Sale(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES Product(id)
    )`
  ];

  for (const query of queries) {
    try {
      await libsql.execute(query);
      console.log(`✅ Query executada com sucesso.`);
    } catch (e) {
      console.error(`❌ Erro na query:`, e);
    }
  }

  console.log("✨ Tabelas criadas!");
}

main();
