"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import { Product } from "@/types/product";
import { useLanguage } from "@/components/providers/LanguageProvider";

type ProductModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id"> | Product) => Promise<boolean>;
};

type ProductForm = Omit<Product, "id">;

const emptyProduct: ProductForm = {
  name: "",
  category: "",
  stock: 0,
  price: 0,
};

export default function ProductModal({
  product,
  open,
  onClose,
  onSave,
}: ProductModalProps) {
  return open ? (
    <ProductFormModal
      key={product?.id ?? "new"}
      product={product}
      onClose={onClose}
      onSave={onSave}
    />
  ) : null;
}

function ProductFormModal({
  product,
  onClose,
  onSave,
}: Omit<ProductModalProps, "open">) {
  const { t } = useLanguage();
  const [form, setForm] = useState<Product | ProductForm>(
    product ?? emptyProduct,
  );
  const isEditing = Boolean(product);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const isSaved = await onSave({
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
    });
    setIsSaving(false);
    if (isSaved) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? t("editProduct") : t("addProduct")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing ? t("updateProduct") : t("createProduct")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product modal"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder={t("product")}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            required
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value })
            }
            placeholder={t("category")}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              min="0"
              type="number"
              value={form.stock}
              onChange={(event) =>
                setForm({ ...form, stock: Number(event.target.value) })
              }
              placeholder={t("stock")}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: Number(event.target.value) })
              }
              placeholder={t("price")}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? t("saving") : isEditing ? t("save") : t("addProduct")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
