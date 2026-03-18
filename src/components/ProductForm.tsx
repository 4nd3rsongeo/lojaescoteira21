"use client";

import { useState } from "react";
import { Package, ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image: string | null;
}

interface ProductFormProps {
  product: Product | null;
  saveAction: (formData: FormData) => Promise<void>;
}

export default function ProductForm({ product, saveAction }: ProductFormProps) {
  const [preview, setPreview] = useState<string | null>(product?.image || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    // O Next.js vai lidar com o redirect se o Server Action o chamar, 
    // mas o loading state ajuda o usuário a ver que algo está acontecendo
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/estoque" className="flex items-center gap-2 text-scout-blue hover:text-scout-green font-bold uppercase text-[10px] tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para o estoque
      </Link>

      <div className="flex items-center gap-4">
        <div className="bg-scout-green p-3 rounded-2xl text-white shadow-lg shadow-scout-green/20">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
            {product ? "Ajustar Item" : "Novo Cadastro"}
          </h1>
          <p className="text-scout-green font-bold uppercase text-[10px] tracking-[0.3em]">
            {product ? product.name : "Entrada de Patrimônio"}
          </p>
        </div>
      </div>

      <form 
        action={saveAction} 
        onSubmit={handleSubmit}
        className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border)] shadow-sm p-10 space-y-8"
      >
        <input type="hidden" name="id" value={product?.id || ""} />
        <input type="hidden" name="currentImageUrl" value={product?.image || ""} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Campo de Imagem */}
          <div className="md:col-span-2 space-y-4">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">
              Foto do Produto
            </label>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-[var(--background)] border-2 border-dashed border-[var(--border)] rounded-3xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[var(--muted)] opacity-20" />
                )}
              </div>
              <div className="flex-grow w-full">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-[var(--muted)] file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-scout-blue/10 file:text-scout-blue hover:file:bg-scout-blue/20 transition-all cursor-pointer"
                />
                <p className="text-[10px] text-[var(--muted)] mt-2">Recomendado: Quadrado (1:1), JPG ou PNG.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">
              Nome do Item
            </label>
            <input
              type="text"
              name="name"
              defaultValue={product?.name || ""}
              required
              className="w-full input-scout"
              placeholder="Ex: Camiseta do Grupo, Lenço, etc."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">
              Descrição Técnica
            </label>
            <textarea
              name="description"
              defaultValue={product?.description || ""}
              className="w-full input-scout min-h-[120px] resize-none"
              placeholder="Detalhes sobre o tamanho, cor, material..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">
              Categoria
            </label>
            <input
              type="text"
              name="category"
              defaultValue={product?.category || ""}
              className="w-full input-scout"
              placeholder="Ex: Uniforme, Acessório"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">
              Preço Institucional (R$) {product && <span className="text-red-500 font-bold ml-1">(Não editável)</span>}
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              defaultValue={product?.price || ""}
              required
              readOnly={!!product}
              className={`w-full input-scout ${product ? "opacity-60 bg-[var(--background)] cursor-not-allowed" : ""}`}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest block">
              Quantidade em Estoque
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={product?.stock || 0}
              required
              className="w-full input-scout"
              placeholder="0"
            />
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-grow btn-scout-primary h-14 justify-center text-base disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {product ? "Salvar Alterações" : "Efetivar Cadastro"}
          </button>
          <Link href="/estoque" className="px-10 h-14 flex items-center justify-center bg-[var(--background)] text-[var(--muted)] rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[var(--border)] transition-all border border-[var(--border)]">
            Descartar
          </Link>
        </div>
      </form>
    </div>
  );
}
