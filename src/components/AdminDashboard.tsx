"use client";

import { Package, ShoppingCart, Users, ArrowRight, LayoutDashboard, Star, Edit2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  latestUsers?: User[];
}

export default function AdminDashboard({ latestUsers = [] }: AdminDashboardProps) {
  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      <div className="bg-scout-green rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-scout-yellow/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-scout-yellow">
            <Star className="w-3 h-3 fill-current" />
            Administração Central
          </div>
          <h1 className="text-4xl font-black tracking-tight">Sempre Alerta, Administrador!</h1>
          <p className="text-white/70 max-w-lg font-medium">
            Este é o painel de controle avançado da Lojinha. Aqui você pode gerenciar usuários, 
            auditar todas as transações e configurar o catálogo base de produtos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-scout-blue" />
              Gestão Rápida de Usuários
            </h2>
            <Link href="/admin/user/new" className="bg-scout-green text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-scout-green/20">
              Adicionar Novo
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {latestUsers.map((user) => (
                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                      user.role === 'ADMIN' ? 'bg-scout-yellow/20 text-scout-yellow' : 'bg-scout-blue/10 text-scout-blue'
                    }`}>
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{user.name || "Sem nome"}</p>
                      <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      user.role === 'ADMIN' 
                        ? 'bg-scout-yellow/10 border-scout-yellow/20 text-scout-yellow' 
                        : 'bg-scout-blue/10 border-scout-blue/20 text-scout-blue'
                    }`}>
                      {user.role}
                    </span>
                    <Link 
                      href={`/admin/user/${user.id}`}
                      className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-scout-blue hover:text-white transition-all"
                      title="Editar Usuário"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
              {latestUsers.length === 0 && (
                <div className="p-12 text-center text-slate-400 italic text-sm">
                  Nenhum usuário cadastrado.
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800">
              <Link href="/admin/user" className="text-[10px] font-black uppercase text-scout-blue tracking-widest hover:underline">
                Ver todos os usuários
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 px-2">
            <ShieldAlert className="w-6 h-6 text-scout-yellow" />
            Configurações
          </h2>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-scout-green/30 transition-all">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Backup do Banco</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-black opacity-60">Rotina diária automática</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-scout-blue/30 transition-all">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Logs de Auditoria</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-black opacity-60">Rastreabilidade total</p>
              </div>
            </div>
            <Link href="/" className="w-full btn-scout-secondary justify-center py-4 text-xs">
              Voltar ao Portal Principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
