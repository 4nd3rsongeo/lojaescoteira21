"use client";

import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  action: (formData: FormData) => Promise<void>;
}

export default function DeleteProductButton({ productId, action }: DeleteProductButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
        title="Excluir"
        onClick={(e) => {
          if (!confirm("Tem certeza que deseja excluir este item?")) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
