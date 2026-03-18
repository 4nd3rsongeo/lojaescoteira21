import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import "dotenv/config";

async function main() {
  const url = process.env.DATABASE_URL;
  console.log("DEBUG: DATABASE_URL exists:", !!url);
  if (url) {
    console.log("DEBUG: URL starts with:", url.substring(0, 20));
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  console.log("🚀 Iniciando Seed no PostgreSQL...");

  try {
    // 1. Create Admin User
    await prisma.user.upsert({
      where: { email: "admin@escoteiros.org.br" },
      update: { password: hashedPassword },
      create: {
        email: "admin@escoteiros.org.br",
        name: "Admin Escoteiro",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // 2. Create Products
    const products = [
      { name: "Lenço Escoteiro Oficial", description: "Lenço padrão do grupo.", price: 25.00, stock: 50, category: "Uniforme" },
      { name: "Camiseta de Atividade (Verde)", description: "Camiseta 100% algodão.", price: 45.00, stock: 30, category: "Vestuário" },
      { name: "Cinto de Lona com Fivela Flor de Lis", description: "Cinto oficial.", price: 35.00, stock: 15, category: "Uniforme" },
      { name: "Distintivo de Promessa", description: "Insígnia bordada.", price: 5.50, stock: 100, category: "Distintivos" },
      { name: "Canivete Multiuso 11 Funções", description: "Essencial para acampamento.", price: 55.00, stock: 8, category: "Equipamento" },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { id: `seed-${p.name.replace(/\s+/g, "-").toLowerCase()}` },
        update: {},
        create: {
          id: `seed-${p.name.replace(/\s+/g, "-").toLowerCase()}`,
          ...p,
        },
      });
    }

    console.log("✨ Seed finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro no Seed:", error);
  }
}

main();
