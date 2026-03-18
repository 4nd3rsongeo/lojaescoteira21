import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import { Compass } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lojinha Escoteira - Controle de Estoque",
  description: "Sistema de controle de estoque e vendas para grupo escoteiro",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-scout-khaki`}
      >
        <Navigation session={session} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl w-full">
          {children}
        </main>
        <footer className="bg-scout-green/10 py-10 border-t border-scout-green/5 mt-auto">
          <div className="container mx-auto px-4 flex flex-col items-center gap-4">
            <Compass className="w-8 h-8 text-scout-green opacity-20" />
            <div className="text-center">
              <p className="text-scout-green/60 font-black uppercase text-[10px] tracking-[0.5em] mb-1">Grupo Escoteiro</p>
              <p className="text-scout-green font-bold italic">"Sempre Alerta!"</p>
            </div>
            <p className="text-[15px] text-scout-green/40 mt-4 uppercase font-medium text-center">© 2026 Sistema de Lojinha Integrada - DEV Pai da Mirian</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
