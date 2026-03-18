import { prisma } from "@/lib/prisma";
import { Plus, Search, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import ProductTable from "@/components/ProductTable";

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/estoque");
  revalidatePath("/");
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const pageSize = 10;
  
  const totalItems = await prisma.product.count({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  const totalPages = Math.ceil(totalItems / pageSize);
  const skip = (page - 1) * pageSize;

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: "asc" },
    take: pageSize,
    skip: skip,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-scout-green font-black uppercase text-[10px] tracking-[0.4em]">
            <Layers className="w-3 h-3" />
            Gestão de Patrimônio
          </div>
          <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Estoque da Lojinha</h1>
          <p className="text-[var(--muted)] font-medium">Controle de uniformes, distintivos e acessórios</p>
        </div>
        <Link href="/estoque/novo" className="btn-scout-primary shadow-lg shadow-scout-green/20 h-14 px-8 text-base">
          <Plus className="w-6 h-6" />
          Novo Produto
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--background)]/50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] w-5 h-5" />
              <form action="/estoque" method="GET">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Pesquisar por nome ou categoria..."
                  className="w-full pl-12 pr-4 py-4 input-scout border-none shadow-none ring-1 ring-[var(--border)] focus:ring-2"
                />
              </form>
            </div>
          </div>

          <ProductTable products={products} deleteAction={deleteProduct} />
          
          <div className="p-6 bg-[var(--background)]/30 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
              Exibindo {skip + 1} - {Math.min(skip + pageSize, totalItems)} de {totalItems} itens
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href={{
                  pathname: "/estoque",
                  query: { q: query, page: page - 1 },
                }}
                className={`p-2 rounded-lg border border-[var(--border)] transition-all ${
                  page <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-[var(--background)] text-scout-blue"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center">
                      {i > 0 && arr[i-1] !== p - 1 && <span className="px-2 text-[var(--muted)]">...</span>}
                      <Link
                        href={{
                          pathname: "/estoque",
                          query: { q: query, page: p },
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                          page === p
                            ? "bg-scout-green text-white shadow-md shadow-scout-green/20"
                            : "text-[var(--muted)] hover:bg-[var(--background)]"
                        }`}
                      >
                        {p}
                      </Link>
                    </div>
                  ))}
              </div>

              <Link
                href={{
                  pathname: "/estoque",
                  query: { q: query, page: page + 1 },
                }}
                className={`p-2 rounded-lg border border-[var(--border)] transition-all ${
                  page >= totalPages ? "opacity-30 pointer-events-none" : "hover:bg-[var(--background)] text-scout-blue"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="hidden sm:block text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
              "Sempre Alerta"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
