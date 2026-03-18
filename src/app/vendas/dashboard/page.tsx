import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingCart, Calendar, History, TrendingUp, Compass, Plus, Minus } from "lucide-react";
import UndoSaleButton from "@/components/UndoSaleButton";
import { auth } from "@/lib/auth";
import TopSellersCarousel from "@/components/TopSellersCarousel";

export default async function SalesDashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const sales = await prisma.sale.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalItemsSold = await prisma.saleItem.aggregate({
    _sum: { quantity: true }
  });

  const topProducts = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 10
  });

  const topProductsDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      return {
        name: product?.name || "Desconhecido",
        quantity: item._sum.quantity,
        revenue: (item._sum.quantity || 0) * (product?.price || 0),
        image: product?.image || null
      };
    })
  );

  // --- Novos Cálculos para Relatórios por Categoria ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Saídas (Vendas do Mês)
  const monthlySalesItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        createdAt: { gte: startOfMonth }
      }
    },
    include: {
      product: true
    }
  });

  const outflowsByCategory: Record<string, { quantity: number, total: number }> = {};
  monthlySalesItems.forEach(item => {
    const cat = item.product.category || "Geral";
    if (!outflowsByCategory[cat]) outflowsByCategory[cat] = { quantity: 0, total: 0 };
    outflowsByCategory[cat].quantity += item.quantity;
    outflowsByCategory[cat].total += item.quantity * item.unitPrice;
  });

  // Entradas (Produtos cadastrados ou repostos este mês - Simplificado usando createdAt)
  const monthlyEntries = await prisma.product.findMany({
    where: {
      createdAt: { gte: startOfMonth }
    }
  });

  const inflowsByCategory: Record<string, { quantity: number, total: number }> = {};
  monthlyEntries.forEach(item => {
    const cat = item.category || "Geral";
    if (!inflowsByCategory[cat]) inflowsByCategory[cat] = { quantity: 0, total: 0 };
    inflowsByCategory[cat].quantity += item.stock;
    inflowsByCategory[cat].total += item.stock * item.price;
  });

  // --- Alinhamento de Categorias ---
  const allCategories = Array.from(new Set([
    ...Object.keys(inflowsByCategory),
    ...Object.keys(outflowsByCategory)
  ])).sort();

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-scout-blue font-black uppercase text-[10px] tracking-[0.4em]">
            <History className="w-4 h-4" />
            Análise de Operações
          </div>
          <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Relatórios de Vendas</h1>
          <p className="text-[var(--muted)] font-medium">Acompanhamento de faturamento e fluxo de saída</p>
        </div>
        
        <div className="bg-scout-green/10 text-scout-green px-6 py-3 rounded-2xl flex items-center gap-3 border border-scout-green/20">
          <div className="w-2 h-2 bg-scout-green rounded-full animate-pulse"></div>
          <span className="text-xs font-black uppercase tracking-widest">Tempo Real</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Receita Total", val: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-scout-green", bg: "bg-scout-green/10" },
          { label: "Itens Saídos", val: totalItemsSold._sum.quantity || 0, icon: ShoppingCart, color: "text-scout-blue", bg: "bg-scout-blue/10" },
          { label: "Atendimentos", val: sales.length, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((s, i) => (
          <div key={i} className="bg-[var(--card-bg)] p-10 rounded-[2.5rem] border border-[var(--border)] shadow-sm flex items-center gap-8 group hover:border-scout-green/20 hover:shadow-xl transition-all duration-500">
            <div className={`${s.bg} ${s.color} w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <s.icon className="w-10 h-10" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-1">{s.label}</p>
              <p className="text-3xl font-black text-[var(--foreground)]">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Section */}
      <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <TopSellersCarousel items={topProductsDetails} />
      </section>

      {/* --- Novas Sessões de Entradas e Saídas do Mês --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
        {/* Sessão de Entradas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-scout-green/10 rounded-xl flex items-center justify-center text-scout-green">
              <Plus className="w-5 h-5" />
            </div>
            Entradas do Mês (Novos Itens)
          </h2>
          <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm p-8 hover:shadow-xl transition-all">
            <div className="space-y-6">
              {allCategories.map((cat) => {
                const data = inflowsByCategory[cat] || { quantity: 0, total: 0 };
                return (
                  <div key={cat} className={`flex justify-between items-center p-4 bg-[var(--background)]/50 rounded-2xl border border-[var(--border)] group hover:border-scout-green/30 transition-all ${data.quantity === 0 ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-scout-green/10 rounded-lg flex items-center justify-center text-scout-green font-black text-xs uppercase">
                        {cat[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{cat}</p>
                        <p className="text-[10px] font-black uppercase text-[var(--muted)]">{data.quantity} unidades adicionadas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-scout-green">R$ {data.total.toFixed(2)}</p>
                      <p className="text-[8px] font-black uppercase text-[var(--muted)] tracking-widest">Valor em Estoque</p>
                    </div>
                  </div>
                );
              })}
              {allCategories.length === 0 && (
                <p className="text-center py-10 text-[var(--muted)] italic text-sm">Nenhuma movimentação registrada.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sessão de Saídas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <Minus className="w-5 h-5" />
            </div>
            Saídas do Mês (Vendas)
          </h2>
          <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm p-8 hover:shadow-xl transition-all">
            <div className="space-y-6">
              {allCategories.map((cat) => {
                const data = outflowsByCategory[cat] || { quantity: 0, total: 0 };
                return (
                  <div key={cat} className={`flex justify-between items-center p-4 bg-[var(--background)]/50 rounded-2xl border border-[var(--border)] group hover:border-red-500/30 transition-all ${data.quantity === 0 ? 'opacity-40 grayscale' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 font-black text-xs uppercase">
                        {cat[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{cat}</p>
                        <p className="text-[10px] font-black uppercase text-[var(--muted)]">{data.quantity} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-red-500">R$ {data.total.toFixed(2)}</p>
                      <p className="text-[8px] font-black uppercase text-[var(--muted)] tracking-widest">Faturamento</p>
                    </div>
                  </div>
                );
              })}
              {allCategories.length === 0 && (
                <p className="text-center py-10 text-[var(--muted)] italic text-sm">Nenhuma movimentação registrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-scout-green/10 rounded-xl flex items-center justify-center text-scout-green">
              <History className="w-5 h-5" />
            </div>
            Histórico de Transações
          </h2>
          <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm overflow-hidden hover:shadow-xl transition-all">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--background)] text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] border-b border-[var(--border)]">
                    <th className="py-6 px-10">Data/Hora</th>
                    <th className="py-6 px-10">Itens</th>
                    <th className="py-6 px-10">Operador</th>
                    <th className="py-6 px-10 text-right">Total</th>
                    <th className="py-6 px-10 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-[var(--background)]/50 transition-colors group">
                      <td className="py-8 px-10">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--foreground)]">
                            {new Date(sale.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">
                            {new Date(sale.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <div className="text-xs text-[var(--muted)] max-w-[200px] truncate font-medium group-hover:text-scout-blue transition-colors">
                          {sale.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <span className="text-[10px] font-black uppercase text-scout-blue bg-scout-blue/5 px-4 py-2 rounded-full border border-scout-blue/10">
                          {sale.user.name?.split(' ')[0]}
                        </span>
                      </td>
                      <td className="py-8 px-10 text-right font-black text-[var(--foreground)] text-lg">
                        R$ {sale.total.toFixed(2)}
                      </td>
                      <td className="py-8 px-10 text-center">
                        {isAdmin && <UndoSaleButton saleId={sale.id} />}
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <Compass className="w-12 h-12 mx-auto mb-4 text-[var(--muted)] opacity-20 animate-spin-slow" />
                        <p className="text-[var(--muted)] font-black uppercase tracking-widest text-xs opacity-40">Nenhum registro encontrado</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-scout-blue/10 rounded-xl flex items-center justify-center text-scout-blue">
              <TrendingUp className="w-5 h-5" />
            </div>
            Ranking de Volume
          </h2>
          <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm p-10 space-y-10 hover:shadow-xl transition-all">
            {topProductsDetails.map((item, index) => (
              <div key={item.name} className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="font-bold text-[var(--foreground)] leading-tight">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-scout-green rounded-full"></span>
                      <p className="text-[10px] font-black uppercase text-scout-green tracking-widest">{item.quantity} unidades</p>
                    </div>
                  </div>
                  <p className="font-black text-[var(--foreground)] text-sm italic">R$ {item.revenue.toFixed(2)}</p>
                </div>
                <div className="w-full bg-[var(--background)] h-3 rounded-full overflow-hidden border border-[var(--border)]">
                  <div 
                    className="bg-scout-blue h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(item.quantity! / (topProductsDetails[0].quantity || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topProductsDetails.length === 0 && (
              <div className="py-20 text-center text-[var(--muted)] font-bold uppercase tracking-[0.2em] opacity-30 text-xs">
                Aguardando dados...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
