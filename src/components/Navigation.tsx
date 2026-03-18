"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X 
} from "lucide-react";
import { signOut } from "@/lib/actions";

interface NavigationProps {
  session: any;
}

export default function Navigation({ session }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu ao mudar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!session) return null;

  const navLinks = [
    { href: "/", label: "Início", icon: LayoutDashboard },
    { href: "/estoque", label: "Estoque", icon: Package },
    { href: "/vendas", label: "Vendas", icon: ShoppingCart },
    { href: "/vendas/dashboard", label: "Relatórios", icon: BarChart2 },
  ];

  if (session.user?.role === 'ADMIN') {
    navLinks.push({ href: "/admin", label: "Admin", icon: User });
  }

  return (
    <>
      <header className="bg-scout-green text-white shadow-lg sticky top-0 z-[60] border-b-4 border-scout-yellow">
        <div className="container mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-white/10 p-2 rounded-xl border border-white/20 group-hover:bg-scout-yellow/10 transition-colors">
              <Compass className="w-8 h-8 text-scout-yellow" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-tight uppercase">Lojinha</span>
              <span className="font-medium text-[10px] tracking-[0.3em] uppercase opacity-70">Escoteira</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`nav-link-scout ${isActive ? 'nav-link-active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end border-l border-white/20 pl-4">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Sempre Alerta</span>
              <span className="text-xs font-bold text-scout-yellow truncate max-w-[100px]">
                {session.user?.name?.split(' ')[0]}
              </span>
            </div>
            
            <form action={signOut} className="hidden sm:block">
              <button type="submit" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-red-400">
                <LogOut className="w-5 h-5" />
              </button>
            </form>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 bg-white/10 rounded-xl border border-white/20 text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-scout-green z-[80] lg:hidden transform transition-transform duration-500 ease-in-out shadow-2xl border-r border-white/10 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 border-b border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Compass className="w-10 h-10 text-scout-yellow animate-spin-slow" />
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-tighter uppercase">Menu Central</span>
              <span className="text-[10px] text-scout-yellow font-black uppercase tracking-widest">Sempre Alerta</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                  isActive 
                    ? "bg-scout-yellow text-scout-green shadow-lg shadow-scout-yellow/20 translate-x-2" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4 bg-black/10">
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-scout-yellow/20 flex items-center justify-center text-scout-yellow font-black text-sm border border-scout-yellow/30">
              {session.user?.name?.[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm truncate max-w-[150px]">{session.user?.name}</span>
              <span className="text-[10px] text-white/50 uppercase font-black">{session.user?.role}</span>
            </div>
          </div>
          <form action={signOut}>
            <button type="submit" className="w-full flex items-center justify-center gap-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-500/20">
              <LogOut className="w-4 h-4" />
              Encerrar Sessão
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
