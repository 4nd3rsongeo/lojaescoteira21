"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Compass, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha inválidos");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)] p-6 sm:p-12 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-scout-blue"></div>
      
      <div className="w-full max-w-lg bg-[var(--card-bg)] shadow-2xl rounded-[3rem] overflow-hidden border border-[var(--border)] flex flex-col animate-in fade-in zoom-in duration-500">
        <div className="bg-scout-green p-12 text-center text-white relative">
          <div className="absolute top-4 right-4 text-white/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20">
              <Compass className="w-16 h-16 text-scout-yellow animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-[0.2em]">Lojinha Escoteira</h1>
          <p className="text-green-300 font-medium mt-3 italic tracking-wide">"Sempre Alerta para servir"</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-8 flex-grow">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border-2 border-red-200 dark:border-red-900/30 text-sm font-bold text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-xs font-black text-scout-blue uppercase tracking-widest block pl-1">
              Endereço de Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-[var(--border)] bg-[var(--input-bg)] text-scout-blue rounded-2xl focus:border-scout-blue focus:ring-4 focus:ring-scout-blue/10 outline-none transition-all text-lg placeholder:text-scout-blue/30 font-bold"
              placeholder="seu-email@escoteiros.org.br"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-black text-scout-blue uppercase tracking-widest block pl-1">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-[var(--border)] bg-[var(--input-bg)] text-scout-blue rounded-2xl focus:border-scout-blue focus:ring-4 focus:ring-scout-blue/10 outline-none transition-all text-lg placeholder:text-scout-blue/30 font-bold"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-scout-blue text-white hover:bg-[#00467a] active:scale-[0.98] transition-all py-5 rounded-2xl font-black uppercase tracking-widest text-xl shadow-lg shadow-scout-blue/20 flex justify-center items-center gap-3 mt-4 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Fazer Login"}
          </button>
        </form>
        
        <div className="bg-[var(--background)]/50 p-6 text-center border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--muted)] uppercase font-black tracking-[0.3em]">
            Sistema de Gestão Integrada • Grupo Escoteiro
          </p>
        </div>
      </div>
    </div>
  );
}
