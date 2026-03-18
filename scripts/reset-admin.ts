import { createClient } from "@libsql/client";
import bcrypt from 'bcryptjs';
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

const dbUrl = getEnv("TURSO_DATABASE_URL");
const dbKey = getEnv("TURSO_AUTH_TOKEN");

if (!dbUrl || !dbKey) {
  console.error("❌ Erro: TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não definidos no .env");
  process.exit(1);
}

const libsql = createClient({
  url: dbUrl,
  authToken: dbKey,
});

async function resetPassword() {
  console.log("🛠️ Iniciando reset de senha do administrador...");
  
  const email = "admin@escoteiros.org.br";
  const newPassword = "admin123";
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const result = await libsql.execute({
      sql: "UPDATE User SET password = ? WHERE email = ?",
      args: [hashedPassword, email]
    });

    if (result.rowsAffected > 0) {
      console.log(`✅ Senha para ${email} resetada com sucesso para: ${newPassword}`);
    } else {
      console.log("⚠️ Usuário não encontrado no Turso. Criando novo administrador...");
      await libsql.execute({
        sql: "INSERT INTO User (id, name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: ["admin-fixed-id", "Admin Escoteiro", email, hashedPassword, "ADMIN", Date.now(), Date.now()]
      });
      console.log(`✅ Novo administrador criado com senha: ${newPassword}`);
    }
  } catch (error) {
    console.error("❌ Erro ao resetar senha:", error);
  }
}

resetPassword();
