import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';

// Fallback manual env parsing
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

const s3 = new S3Client({
  region: "auto",
  endpoint: getEnv("R2_ENDPOINT"),
  credentials: {
    accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
  },
});

function generateSafeName(originalName: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(`${Date.now()}-${originalName}`);
  const extension = originalName.split(".").pop() || "jpg";
  return `${hash.digest("hex").substring(0, 16)}.${extension}`;
}

export async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Se não houver credenciais R2, retorna a imagem como Data URL (Base64) para não perder o dado localmente
    if (!getEnv("R2_ACCESS_KEY_ID") || !getEnv("R2_ENDPOINT")) {
      console.warn("⚠️ R2 não configurado. Convertendo imagem para Base64 como fallback.");
      const base64 = buffer.toString('base64');
      const contentType = file.type || "image/jpeg";
      return `data:${contentType};base64,${base64}`;
    }

    const safeFileName = generateSafeName(file.name);
    const contentType = file.type || "application/octet-stream";

    await s3.send(
      new PutObjectCommand({
        Bucket: getEnv("R2_BUCKET_NAME"),
        Key: safeFileName,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return `${getEnv("R2_PUBLIC_URL")}/${safeFileName}`;
  } catch (error) {
    console.error("Erro no upload R2:", error);
    // Em caso de erro técnico mas com arquivo válido, tenta Base64 como última alternativa
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      return `data:${file.type};base64,${buffer.toString('base64')}`;
    } catch {
      return null;
    }
  }
}

export async function uploadFromUrl(url: string, fileName: string): Promise<string | null> {
  try {
    // Se não houver credenciais R2, retorna a URL original como fallback
    if (!getEnv("R2_ACCESS_KEY_ID") || !getEnv("R2_ENDPOINT")) {
      console.warn("⚠️ R2 não configurado. Usando URL original como fallback.");
      return url;
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeFileName = generateSafeName(fileName);
    
    await s3.send(
      new PutObjectCommand({
        Bucket: getEnv("R2_BUCKET_NAME"),
        Key: safeFileName,
        Body: buffer,
        ContentType: response.headers.get("content-type") || "image/jpeg",
      })
    );

    return `${getEnv("R2_PUBLIC_URL")}/${safeFileName}`;
  } catch (error) {
    console.error(`Erro ao subir imagem da URL ${url}:`, error);
    return url; // Retorna a URL original em caso de erro
  }
}
