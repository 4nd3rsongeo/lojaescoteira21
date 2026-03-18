import { createClient } from "@libsql/client";
import { uploadFromUrl } from "../src/lib/r2";
import fs from 'fs';
import path from 'path';

// Manual env parsing
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

const IMAGE_MAP: Record<string, string> = {
  "Lenço Escoteiro Oficial": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400",
  "Camiseta de Atividade (Verde)": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400",
  "Cinto de Lona com Fivela Flor de Lis": "https://images.unsplash.com/photo-1624222247344-550fb8ec973d?auto=format&fit=crop&q=80&w=400",
  "Meião Escoteiro (Azul)": "https://images.unsplash.com/photo-1582966298601-83c44bc1d8a1?auto=format&fit=crop&q=80&w=400",
  "Bermuda de Sarja Caqui": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400",
  "Distintivo de Promessa": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400",
  "Canivete Multiuso 11 Funções": "https://images.unsplash.com/photo-1594494424758-a23a507fbd6a?auto=format&fit=crop&q=80&w=400",
  "Lanterna de LED Recarregável": "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?auto=format&fit=crop&q=80&w=400",
  "Caneca de Alumínio 300ml": "https://images.unsplash.com/photo-1577937927133-66ef06ac9959?auto=format&fit=crop&q=80&w=400",
};

async function main() {
  console.log("🚀 [Direct LibSQL] Iniciando atualização de imagens...");

  const result = await libsql.execute("SELECT id, name FROM Product");
  const products = result.rows;

  for (const product of products) {
    const id = product.id as string;
    const name = product.name as string;
    
    const placeholderUrl = IMAGE_MAP[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=006b3f&color=fff&size=400`;
    
    console.log(`📸 Processando: ${name}...`);
    
    const r2Url = await uploadFromUrl(placeholderUrl, `${id}.jpg`);
    
    if (r2Url) {
      await libsql.execute({
        sql: "UPDATE Product SET image = ? WHERE id = ?",
        args: [r2Url, id]
      });
      console.log(`✅ Sucesso: ${r2Url}`);
    } else {
      console.log(`❌ Falha no upload para ${name}`);
    }
  }

  console.log("✨ Processo finalizado!");
}

main().catch(console.error);
