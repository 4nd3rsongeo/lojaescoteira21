import { prisma } from "@/lib/prisma";
import SalesPOS from "@/components/SalesPOS";
import { ShoppingBag } from "lucide-react";

export default async function VendasPage() {
  // Busca os 15 produtos mais vendidos que possuem estoque
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: [
      {
        SaleItem: {
          _count: 'desc'
        }
      },
      {
        name: 'asc'
      }
    ],
    take: 15,
  });

  return (
    <div className="space-y-10 h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center shrink-0 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-scout-yellow rounded-2xl flex items-center justify-center text-scout-green shadow-lg shadow-scout-yellow/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Registrar Venda</h1>
            <p className="text-scout-blue uppercase text-[10px] font-black tracking-[0.3em] opacity-70">Operação de Caixa • Top 15 Itens</p>
          </div>
        </div>
      </div>
      
      <div className="flex-grow min-h-0 bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border)] shadow-sm overflow-hidden p-2">
        <SalesPOS initialProducts={products} />
      </div>
    </div>
  );
}
