import { createClient } from "@libsql/client";
import fs from 'fs';
import path from 'path';

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

const url = getEnv("TURSO_DATABASE_URL");
const authToken = getEnv("TURSO_AUTH_TOKEN");

if (!url || !authToken) {
  console.error("❌ Erro: TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não definidos no .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function verify() {
  console.log("🔍 Conectando ao Turso para verificação de tabelas...");
  try {
    const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    const tables = result.rows.map(row => row.name);
    
    if (tables.length === 0) {
      console.log("ℹ️ O banco de dados está conectado, mas não possui nenhuma tabela.");
    } else {
      console.log("✅ Tabelas encontradas:", tables.join(", "));
      
      for (const table of tables) {
        const count = await client.execute(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`   - ${table}: ${count.rows[0].total} registros`);
      }
    }
  } catch (error) {
    console.error("❌ Falha na conexão com o Turso:", error);
  } finally {
    client.close();
  }
}

verify();
