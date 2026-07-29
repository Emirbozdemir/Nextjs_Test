"use client";

import { useEffect, useState } from "react";

import { Boxes, CheckCircle2, CircleDollarSign, Package } from "lucide-react";

import ProductModal from "@/components/modals/ProductModal";
import ProductsTable from "@/products/ProductsTable";
import StatsCard from "@/components/ui/StatsCard";

import { initialProducts } from "@/data/products";
import { Product } from "@/types/product";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Toast = {
  message: string;
  id: number;
} | null;

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(
    null,
  );

  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = (message: string) => {
    setToast({
      message,
      id: Date.now(),
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductBeingEdited(null);
  };

  const handleSaveProduct = (product: Omit<Product, "id"> | Product) => {
    if ("id" in product) {
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? product : item)),
      );

      showToast("Product updated successfully.");
      return;
    }

    setProducts((current) => [
      ...current,
      {
        ...product,
        id: Math.max(0, ...current.map((item) => item.id)) + 1,
      },
    ]);

    showToast("Product added successfully.");
  };

  const handleEdit = (product: Product) => {
    setProductBeingEdited(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));

    showToast("Product deleted successfully.");
  };

  const productsInStock = products.filter(
    (product) => product.stock > 0,
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(inventoryValue);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("products")}</h1>

          <p className="mt-1 text-slate-500">{t("manageProducts")}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + {t("addProduct")}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title={t("products")}
          value={products.length.toString()}
          color="bg-blue-600"
          icon={Package}
        />

        <StatsCard
          title={t("inStock")}
          value={productsInStock.toString()}
          color="bg-green-600"
          icon={Boxes}
        />

        <StatsCard
          title={t("inventoryValue")}
          value={formattedValue}
          color="bg-yellow-500"
          icon={CircleDollarSign}
        />
      </div>

      <ProductsTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductModal
        open={isModalOpen}
        product={productBeingEdited}
        onClose={closeModal}
        onSave={handleSaveProduct}
      />

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          <CheckCircle2 size={18} className="text-emerald-400" />

          {toast.message}
        </div>
      )}
    </section>
  );
}
