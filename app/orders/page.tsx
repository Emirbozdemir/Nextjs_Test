"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ShoppingBag,
} from "lucide-react";

import OrdersTable from "@/components/orders/OrdersTable";
import UserStatsCard from "@/components/users/UserStatsCard";
import { initialOrders } from "@/data/orders";
import { Order, OrderStatus } from "@/types/order";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Toast = { message: string; id: number } | null;

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  const handleStatusChange = (id: number, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
    setToast({
      message: `Order #${id} marked as ${status.toLowerCase()}.`,
      id: Date.now(),
    });
  };
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending" || order.status === "Processing",
  ).length;
  const deliveredRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((total, order) => total + order.total, 0);
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(deliveredRevenue);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t("orders")}</h1>
        <p className="mt-1 text-slate-500">{t("manageOrders")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <UserStatsCard
          title={t("totalOrders")}
          value={orders.length.toString()}
          color="bg-blue-600"
          icon={ShoppingBag}
        />
        <UserStatsCard
          title={t("openOrders")}
          value={pendingOrders.toString()}
          color="bg-yellow-500"
          icon={Clock3}
        />
        <UserStatsCard
          title={t("deliveredRevenue")}
          value={money}
          color="bg-green-600"
          icon={CircleDollarSign}
        />
      </div>
      <OrdersTable orders={orders} onStatusChange={handleStatusChange} />
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
