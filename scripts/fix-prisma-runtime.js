import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const prismaRuntimePath = path.join(root, 'node_modules', '@prisma', 'client', 'runtime');

function fix() {
  if (!fs.existsSync(prismaRuntimePath)) {
    console.log('⚠️ Prisma runtime path not found, skipping fix.');
    return;
  }

  const filesToCreate = [
    { name: 'library.js', content: "module.exports = require('./client.js');" },
    { name: 'library.d.ts', content: "export * from './client';" },
    { name: 'library.mjs', content: "export * from './client.mjs';" }
  ];

  console.log('🔧 Applying Prisma 7 compatibility fix for next-admin...');

  filesToCreate.forEach(file => {
    const filePath = path.join(prismaRuntimePath, file.name);
    try {
      fs.writeFileSync(filePath, file.content);
      console.log(`✅ Created ${file.name}`);
    } catch (err) {
      console.error(`❌ Failed to create ${file.name}:`, err.message);
    }
  });
}

fix();
