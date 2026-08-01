"use client";

import { type ReactNode } from "react";
import { CalendarDays, Mail, Package, X } from "lucide-react";

import Badge from "@/components/ui/Badge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Order, OrderStatus } from "@/types/order";

type OrderDetailsModalProps = { order: Order | null; onClose: () => void };

const badgeColor: Record<OrderStatus, "yellow" | "blue" | "green" | "red"> = {
  Pending: "yellow",
  Processing: "blue",
  Delivered: "green",
  Cancelled: "red",
};

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  const { t } = useLanguage();
  if (!order) return null;

  const total = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(order.total);
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${order.date}T00:00:00`));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {t("order")} #{order.id}
            </p>
            <h2
              id="order-details-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {t("orderDetails")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{order.customer}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Mail size={15} />
              {order.email}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Detail
              icon={<Package size={17} />}
              label={t("items")}
              value={order.items.toString()}
            />
            <Detail
              icon={<CalendarDays size={17} />}
              label={t("date")}
              value={date}
            />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm text-slate-500">{t("total")}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
            </div>
            <Badge color={badgeColor[order.status]}>{order.status}</Badge>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
