"use client";

import { useState } from "react";
import { Package, Tag, Edit2, X, ShoppingCart, Layers } from "lucide-react";
import Link from "next/link";
import DeleteProductButton from "./DeleteProductButton";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image: string | null;
}

interface ProductTableProps {
  products: Product[];
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function ProductTable({ products, deleteAction }: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--background)]/30 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] border-b border-[var(--border)]">
                <th className="py-5 px-6">Produto</th>
                <th className="py-5 px-6">Categoria</th>
                <th className="py-5 px-6 text-right">Preço Unitário</th>
                <th className="py-5 px-6 text-center">Disponível</th>
                <th className="py-5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-scout-khaki/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[var(--background)] rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] overflow-hidden shrink-0 group-hover:border-scout-green/30 transition-all shadow-sm">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Package className="w-8 h-8 opacity-20" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--foreground)] text-lg leading-tight">{product.name}</div>
                        <div className="text-sm text-[var(--muted)] line-clamp-1 max-w-xs">{product.description || "Sem descrição"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-scout-blue opacity-40" />
                      <span className="text-xs font-black uppercase tracking-widest text-scout-blue">
                        {product.category || "Geral"}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right font-black text-[var(--foreground)]">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-6 px-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-black ${
                        product.stock <= 5 ? "text-red-500" : "text-scout-green"
                      }`}>
                        {product.stock}
                      </span>
                      {product.stock <= 5 && (
                        <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter">Reposição Crítica</span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end items-center gap-2">
                      <Link 
                        href={`/estoque/editar/${product.id}`}
                        className="w-10 h-10 flex items-center justify-center text-[var(--muted)] hover:text-scout-blue hover:bg-scout-blue/5 rounded-xl transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <DeleteProductButton productId={product.id} action={deleteAction} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Package className="w-16 h-16" />
                      <p className="font-bold text-xl uppercase tracking-widest">Nenhum item encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes do Produto Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-[var(--card-bg)] w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-[var(--background)] relative">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--muted)] opacity-20">
                  <Package className="w-24 h-24" />
                </div>
              )}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 md:hidden w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6 relative">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="hidden md:flex absolute top-6 right-6 w-10 h-10 hover:bg-[var(--background)] rounded-full items-center justify-center text-[var(--muted)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-scout-blue font-black uppercase text-[10px] tracking-[0.4em]">
                  <Tag className="w-3 h-3" />
                  {selectedProduct.category || "Geral"}
                </div>
                <h2 className="text-3xl font-black text-[var(--foreground)] leading-tight">{selectedProduct.name}</h2>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">Descrição Técnica</span>
                <p className="text-[var(--foreground)] leading-relaxed opacity-80">
                  {selectedProduct.description || "Este item não possui uma descrição técnica detalhada cadastrada no momento."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-[var(--border)]">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">Preço</span>
                  <div className="text-2xl font-black text-scout-green">
                    R$ {selectedProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">Estoque</span>
                  <div className={`text-2xl font-black ${selectedProduct.stock <= 5 ? "text-red-500" : "text-[var(--foreground)]"}`}>
                    {selectedProduct.stock} <span className="text-xs font-bold uppercase opacity-40">Unid.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Link 
                  href={`/estoque/editar/${selectedProduct.id}`}
                  className="flex-grow btn-scout-primary justify-center py-4"
                >
                  <Edit2 className="w-5 h-5" />
                  Editar Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
