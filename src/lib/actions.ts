"use server";

import { prisma } from "@/lib/prisma";
import { auth, signOut as nextAuthSignOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface SaleItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export async function signOut() {
  await nextAuthSignOut({ redirectTo: "/login" });
}

export async function createSale(items: SaleItemInput[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Usuário não autenticado" };
  }

  try {
    const total = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          total,
          userId: session.user.id as string,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }))
          }
        }
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product?.name || item.productId}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newSale;
    });

    revalidatePath("/vendas");
    revalidatePath("/estoque");
    revalidatePath("/");
    revalidatePath("/vendas/dashboard");

    return { success: true, saleId: sale.id };
  } catch (error: any) {
    console.error("Erro ao realizar venda:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
}

/**
 * Undoes a sale by deleting the sale record and returning items to stock.
 */
export async function undoSale(saleId: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: "Apenas administradores podem desfazer vendas." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get sale details including items
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { items: true }
      });

      if (!sale) throw new Error("Venda não encontrada.");

      // 2. Increment stock for each item back
      for (const item of sale.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      // 3. Delete the sale (SaleItem will be deleted via Cascade onDelete defined in schema)
      await tx.sale.delete({
        where: { id: saleId }
      });
    });

    revalidatePath("/vendas/dashboard");
    revalidatePath("/estoque");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao desfazer venda:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
}
