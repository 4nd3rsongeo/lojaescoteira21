"use client";

import { Package, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface TopSeller {
  name: string;
  quantity: number | null;
  revenue: number;
  image: string | null;
}

export default function TopSellersCarousel({ items }: { items: TopSeller[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-6 relative group">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-scout-green" />
          Produtos em Destaque
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--muted)] hover:text-scout-green hover:border-scout-green transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--muted)] hover:text-scout-green hover:border-scout-green transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x scrollbar-hide pb-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div 
            key={item.name}
            className="flex-shrink-0 w-[280px] snap-start bg-[var(--card-bg)] rounded-[2rem] border border-[var(--border)] p-6 space-y-4 hover:shadow-xl transition-all group/item"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--background)] border border-[var(--border)]">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--muted)] opacity-20">
                  <Package className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-scout-green text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                TOP {index + 1}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-[var(--foreground)] text-lg leading-tight truncate">{item.name}</h3>
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-[10px] font-black uppercase text-scout-blue opacity-60">Volume</p>
                  <p className="font-black text-scout-green text-lg">{item.quantity} un.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-scout-blue opacity-60">Receita</p>
                  <p className="font-black text-[var(--foreground)]">R$ {item.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
