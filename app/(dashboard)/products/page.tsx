"use client";

import { useEffect, useState } from "react";

import { Boxes, CheckCircle2, CircleDollarSign, Package } from "lucide-react";

import ProductModal from "@/components/modals/ProductModal";
import ProductsTable from "@/products/ProductsTable";
import StatsCard from "@/components/ui/StatsCard";

import { initialProducts } from "@/data/products";
import { Product } from "@/types/product";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { languages } from "@/lib/languages";

type Toast = {
  message: string;
  id: number;
} | null;

const demoProductsStorageKey = "adminpro-demo-products";

function getStoredProducts() {
  try {
    const saved = window.localStorage.getItem(demoProductsStorageKey);
    const parsed: unknown = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? (parsed as Product[]) : initialProducts;
  } catch {
    return initialProducts;
  }
}

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(
    null,
  );

  const [toast, setToast] = useState<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load products.");
        setProducts(await response.json());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setProducts(getStoredProducts());
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

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
  const saveDemoProducts = (nextProducts: Product[]) => {
    window.localStorage.setItem(
      demoProductsStorageKey,
      JSON.stringify(nextProducts),
    );
    return nextProducts;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductBeingEdited(null);
  };

  const handleSaveProduct = async (product: Omit<Product, "id"> | Product) => {
    if ("id" in product) {
      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error("Unable to update product.");

        const savedProduct = await response.json();
        setProducts((current) =>
          current.map((item) => (item.id === product.id ? savedProduct : item)),
        );
        showToast(t("productUpdated"));
        return true;
      } catch {
        setProducts((current) =>
          saveDemoProducts(
            current.map((item) => (item.id === product.id ? product : item)),
          ),
        );
        showToast(t("productUpdated"));
        return true;
      }
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Unable to create product.");

      const savedProduct = await response.json();
      setProducts((current) => [savedProduct, ...current]);
      showToast(t("productCreated"));
      return true;
    } catch {
      const localProduct: Product = {
        ...product,
        id: Math.max(0, ...products.map((item) => item.id)) + 1,
      };
      setProducts((current) => saveDemoProducts([localProduct, ...current]));
      showToast(t("productCreated"));
      return true;
    }
  };

  const handleEdit = (product: Product) => {
    setProductBeingEdited(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete product.");

      setProducts((current) => current.filter((product) => product.id !== id));
      showToast(t("productDeleted"));
    } catch {
      setProducts((current) =>
        saveDemoProducts(current.filter((product) => product.id !== id)),
      );
      showToast(t("productDeleted"));
    }
  };

  const productsInStock = products.filter(
    (product) => product.stock > 0,
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );

  const formattedValue = new Intl.NumberFormat(languages[language].locale, {
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

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

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
