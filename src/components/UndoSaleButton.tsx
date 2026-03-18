"use client";

import { undoSale } from "@/lib/actions";
import { RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";

export default function UndoSaleButton({ saleId }: { saleId: string }) {
  const [loading, setLoading] = useState(false);

  const handleUndo = async () => {
    if (!confirm("Deseja realmente estornar esta venda? Os itens voltarão ao estoque e o registro será removido.")) {
      return;
    }

    setLoading(true);
    try {
      const result = await undoSale(saleId);
      if (!result.success) {
        alert(result.error);
      }
    } catch (err) {
      alert("Erro ao processar estorno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUndo}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      title="Estornar Venda"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
    </button>
  );
}
