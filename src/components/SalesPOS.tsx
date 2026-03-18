"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, CheckCircle, Loader2 } from "lucide-react";
import { createSale } from "@/lib/actions";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function SalesPOS({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, initialProducts]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, Math.min(item.product.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    
    try {
      const result = await createSale(cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price
      })));
      
      if (result.success) {
        setCart([]);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Erro ao realizar venda: " + result.error);
      }
    } catch (err) {
      alert("Ocorreu um erro inesperado.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-scout-green animate-in fade-in zoom-in duration-300">
        <CheckCircle className="w-32 h-32 mb-4" />
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Venda Realizada!</h2>
        <p className="text-xl font-medium mt-2 text-[var(--foreground)]">O estoque foi atualizado automaticamente.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 btn-scout-primary text-xl px-12 py-4"
        >
          Nova Venda
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
      {/* Product Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
        <div className="relative shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar produto pelo nome..."
            className="w-full pl-12 pr-4 py-5 input-scout text-lg shadow-sm border-[var(--border)] focus:ring-scout-green/20"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 custom-scrollbar">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="group card-scout hover:border-scout-green hover:shadow-xl transition-all text-left flex flex-col gap-4 p-5 h-full relative overflow-hidden disabled:opacity-50 disabled:grayscale"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-scout-green/5 rounded-bl-[2rem] group-hover:bg-scout-green/10 transition-colors"></div>
              
              <div className="bg-scout-green/10 w-12 h-12 rounded-2xl flex items-center justify-center text-scout-green shrink-0 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              
              <div className="flex-grow space-y-1">
                <p className="font-bold text-[var(--foreground)] text-base leading-tight line-clamp-2">{product.name}</p>
                <p className="text-lg font-black text-scout-green uppercase tracking-tighter">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
              
              <div className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest border-t border-[var(--border)] pt-3 flex justify-between items-center">
                <span>Disponível</span>
                <span className={`text-xs ${product.stock <= 5 ? 'text-red-500' : 'text-scout-blue'}`}>
                  {product.stock} un.
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] flex flex-col h-full shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-scout-blue/5 rounded-bl-[5rem] -mr-8 -mt-8"></div>
        
        <div className="p-8 pb-4 flex items-center gap-3 text-[var(--foreground)] shrink-0 relative">
          <div className="w-10 h-10 bg-scout-blue/10 rounded-xl flex items-center justify-center text-scout-blue">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest">Carrinho</h2>
          <span className="ml-auto bg-scout-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {cart.length} itens
          </span>
        </div>

        <div className="flex-grow overflow-y-auto px-8 space-y-4 mb-4 custom-scrollbar">
          {cart.map(item => (
            <div key={item.product.id} className="bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--border)] space-y-3 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start">
                <p className="font-bold text-[var(--foreground)] text-sm leading-tight pr-4">{item.product.name}</p>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-1">
                  <button 
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background)] rounded-lg text-scout-blue transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black w-8 text-center text-[var(--foreground)]">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background)] rounded-lg text-scout-blue transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-black text-scout-green">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] opacity-30 py-20">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">O carrinho está vazio</p>
            </div>
          )}
        </div>

        <div className="p-8 shrink-0 bg-[var(--background)]/30 border-t border-[var(--border)] space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Total Investido</p>
              <p className="text-3xl font-black text-scout-green">
                R$ {total.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full btn-scout-primary h-16 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale shadow-xl shadow-scout-green/20"
          >
            {isCheckingOut ? <Loader2 className="animate-spin" /> : (
              <>
                <CreditCard className="w-6 h-6" />
                Finalizar Venda
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
