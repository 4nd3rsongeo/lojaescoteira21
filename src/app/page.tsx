import { prisma } from "@/lib/prisma";
import { AlertTriangle, Package, TrendingUp, DollarSign, ArrowRight, Layers, Users, Shield, Compass, Star } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";

export default async function DashboardPage() {
  const totalItems = await prisma.product.count();
  const lowStockItems = await prisma.product.findMany({
    where: { stock: { lte: 5 } },
    take: 5,
  });
  
  const totalStockValue = await prisma.product.aggregate({
    _sum: {
      price: true,
    }
  });

  // Most sold items (top 5)
  const topSellers = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 5
  });

  const topSellersDetails = await Promise.all(
    topSellers.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      return {
        ...product,
        totalSold: item._sum.quantity
      };
    })
  );

  // Sorteia uma imagem da pasta public
  const publicDir = path.join(process.cwd(), "public");
  const files = fs.readdirSync(publicDir);
  const images = files.filter(file => /\.(jpg|jpeg|png|webp|JPG)$/i.test(file));
  const randomImage = images.length > 0 ? `/${images[Math.floor(Math.random() * images.length)]}` : "/IMG_2876.jpg";

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-[3rem] bg-scout-green shadow-2xl shadow-scout-green/20 animate-in fade-in zoom-in-95 duration-1000">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={randomImage}
            alt="Fundo Escoteiro" 
            className="w-full h-full object-cover opacity-50 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-scout-green/90 via-scout-green/40 to-transparent"></div>
        </div>

        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-scout-yellow/10 rounded-full -mr-40 -mt-40 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-scout-blue/10 rounded-full -ml-40 -mb-40 blur-[80px] animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-8 py-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-xs font-black uppercase tracking-[0.3em] text-scout-yellow animate-in slide-in-from-left-8 duration-700">
              <Compass className="w-4 h-4 animate-spin-slow" />
              Sempre Alerta • Gestão 2026
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9] animate-in slide-in-from-left-12 duration-1000 delay-100">
              <span className="text-scout-yellow italic">Lojinha </span>             
                do 21 <br />
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl animate-in slide-in-from-left-16 duration-1000 delay-200">
              Todos os itens do grupo de forma organizada e disponíveis sem complicação.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-in slide-in-from-left-20 duration-1000 delay-300">
              <Link href="/vendas" className="group bg-white text-scout-green hover:bg-scout-yellow transition-all px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl flex items-center gap-3 active:scale-95">
                Iniciar Venda
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/estoque" className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white transition-all px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 active:scale-95">
                Ver Estoque
                <Package className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-20 duration-1000 delay-500">
            <div className="space-y-4 pt-12">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl hover:bg-white/15 transition-all group">
                <TrendingUp className="w-10 h-10 text-scout-yellow mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-black text-2xl">Vendas</h3>
                <p className="text-white/60 text-sm">Monitoramento em tempo real.</p>
              </div>
              <div className="bg-scout-yellow p-8 rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
                <Shield className="w-10 h-10 text-scout-green mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-scout-green font-black text-2xl">Seguro</h3>
                <p className="text-scout-green/60 text-sm">Acesso restrito a chefia.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-scout-blue p-8 rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all group">
                <Users className="w-10 h-10 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-black text-2xl">Comunidade</h3>
                <p className="text-white/60 text-sm">Integrado ao grupo.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl hover:bg-white/15 transition-all group">
                <Star className="w-10 h-10 text-scout-yellow mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-black text-2xl">Qualidade</h3>
                <p className="text-white/60 text-sm">Itens selecionados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
        {[
          { label: "Produtos", val: totalItems, icon: Package, color: "text-scout-blue", bg: "bg-scout-blue/10" },
          { label: "Críticos", val: lowStockItems.length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Mais Vendido", val: topSellersDetails[0]?.name || "-", icon: TrendingUp, color: "text-scout-green", bg: "bg-scout-green/10" },
          { label: "Valor Total", val: `R$ ${totalStockValue._sum.price?.toFixed(2) || "0"}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((s, i) => (
          <div key={i} className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-sm flex flex-col gap-6 group hover:border-scout-green/20 hover:shadow-xl transition-all duration-500">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${s.bg} ${s.color} group-hover:scale-110 transition-transform duration-500`}>
              <s.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-1">{s.label}</p>
              <p className="text-2xl font-black text-[var(--foreground)] truncate">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-1000">
        {/* Low Stock Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-4">
              <div className="w-12 h-12 bg-scout-green/10 rounded-2xl flex items-center justify-center text-scout-green">
                <Layers className="w-6 h-6" />
              </div>
              Reposição Necessária
            </h2>
            <Link href="/estoque" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-scout-blue hover:text-scout-green transition-colors">
              Inventário Completo
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm overflow-hidden transition-all hover:shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--background)] text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] border-b border-[var(--border)]">
                    <th className="py-6 px-10">Item do Patrimônio</th>
                    <th className="py-6 px-10">Situação Atual</th>
                    <th className="py-6 px-10 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--background)]/50 transition-colors group">
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[var(--background)] rounded-2xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <Package className="w-6 h-6 opacity-20" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--foreground)] text-lg leading-tight">{item.name}</p>
                            <p className="text-[10px] text-scout-blue font-black uppercase tracking-widest opacity-60">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <div className="flex flex-col">
                          <span className={`text-xl font-black ${item.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                            {item.stock} unidades
                          </span>
                          <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Em estoque</span>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <Link href={`/estoque/editar/${item.id}`} className="inline-flex h-12 px-8 items-center justify-center bg-[var(--background)] hover:bg-scout-green border border-[var(--border)] hover:border-scout-green hover:text-white text-[var(--foreground)] rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                          Repor Item
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {lowStockItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-20 text-center text-[var(--muted)] font-bold uppercase tracking-[0.2em] opacity-40">
                        <Compass className="w-12 h-12 mx-auto mb-4 animate-spin-slow" />
                        Estoque em conformidade operacional
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Sellers Sidebar */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-scout-blue/10 rounded-2xl flex items-center justify-center text-scout-blue">
              <Star className="w-6 h-6" />
            </div>
            Destaques
          </h2>
          <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm p-10 space-y-8 hover:shadow-xl transition-all">
            {topSellersDetails.map((item, index) => (
              <div key={item.id} className="flex items-center gap-6 group">
                <div className="relative">
                  <div className="w-14 h-14 bg-[var(--background)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-scout-green font-black group-hover:bg-scout-green group-hover:text-white transition-all shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-[var(--foreground)] text-lg leading-tight group-hover:text-scout-green transition-colors">{item.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-scout-blue opacity-60">
                    {item.totalSold} vendas realizadas
                  </p>
                </div>
              </div>
            ))}
            {topSellersDetails.length === 0 && (
              <p className="text-center text-[var(--muted)] py-12 italic uppercase text-[10px] font-black tracking-widest opacity-40">Aguardando operações...</p>
            )}
            
            <div className="pt-6">
              <Link href="/vendas/dashboard" className="w-full h-16 border-2 border-dashed border-[var(--border)] hover:border-scout-blue hover:text-scout-blue transition-all rounded-[1.5rem] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] hover:bg-scout-blue/5">
                Relatório de Performance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
