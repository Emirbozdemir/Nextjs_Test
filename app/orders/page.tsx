"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ShoppingBag,
} from "lucide-react";

import OrdersTable from "@/components/orders/OrdersTable";
import OrderStatsCard from "@/components/orders/OrderStatsCard";
import OrderStatusOverview from "@/components/orders/OrderStatusOverview";
import AddOrderModal from "@/components/modals/AddOrderModal";
import OrderDetailsModal from "@/components/modals/OrderDetailsModal";
import { initialOrders } from "@/data/orders";
import { Order, OrderStatus } from "@/types/order";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { languages } from "@/lib/languages";

type Toast = { message: string; id: number } | null;

export default function OrdersPage() {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [toast, setToast] = useState<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load orders.");
        setOrders(await response.json());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          setOrders(initialOrders);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  const handleStatusChange = async (
    id: number,
    status: OrderStatus,
    showToast = true,
  ) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Unable to update order.");

      const savedOrder = await response.json();
      setOrders((current) =>
        current.map((order) => (order.id === id ? savedOrder : order)),
      );
      setSelectedOrder((current) =>
        current?.id === id ? savedOrder : current,
      );
      if (showToast) {
        setToast({
          message: `${t("order")} #${id}: ${t(`orderStatus${status}`)}.`,
          id: Date.now(),
        });
      }
      return true;
    } catch {
      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );
      setSelectedOrder((current) =>
        current?.id === id ? { ...current, status } : current,
      );
      if (showToast) {
        setToast({
          message: `${t("order")} #${id}: ${t("orderUpdatedLocally")}`,
          id: Date.now(),
        });
      }
      return true;
    }
  };
  const handleBulkStatusChange = async (ids: number[], status: OrderStatus) => {
    const results = await Promise.all(
      ids.map((id) => handleStatusChange(id, status, false)),
    );
    const updatedCount = results.filter(Boolean).length;
    setToast({
      message:
        updatedCount > 0
          ? `${updatedCount} ${t("ordersUpdated")}`
          : t("orderUpdateFailed"),
      id: Date.now(),
    });
  };
  const handleCreateOrder = async (order: Omit<Order, "id" | "date">) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      setToast({ message: t("orderCreateFailed"), id: Date.now() });
      return false;
    }

    const savedOrder = await response.json();
    setOrders((current) => [savedOrder, ...current]);
    setToast({
      message: `${t("order")} #${savedOrder.id} ${t("orderCreated")}`,
      id: Date.now(),
    });
    return true;
  };
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending" || order.status === "Processing",
  ).length;
  const deliveredRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((total, order) => total + order.total, 0);
  const money = new Intl.NumberFormat(languages[language].locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(deliveredRevenue);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("orders")}</h1>
          <p className="mt-1 text-slate-500">{t("manageOrders")}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          {t("addOrder")}
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <OrderStatsCard
          title={t("totalOrders")}
          value={orders.length.toString()}
          color="bg-blue-600"
          icon={ShoppingBag}
        />
        <OrderStatsCard
          title={t("openOrders")}
          value={pendingOrders.toString()}
          color="bg-yellow-500"
          icon={Clock3}
        />
        <OrderStatsCard
          title={t("deliveredRevenue")}
          value={money}
          color="bg-green-600"
          icon={CircleDollarSign}
        />
      </div>
      {isLoading ? (
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OrdersTable
            orders={orders}
            onStatusChange={handleStatusChange}
            onBulkStatusChange={handleBulkStatusChange}
            onView={setSelectedOrder}
          />
          <OrderStatusOverview orders={orders} />
        </div>
      )}
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
      <AddOrderModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateOrder}
      />
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </section>
  );
}
