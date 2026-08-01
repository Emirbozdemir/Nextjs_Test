"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Order, OrderStatus } from "@/types/order";

type OrderForm = Omit<Order, "id" | "date">;

type AddOrderModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (order: OrderForm) => Promise<boolean>;
};

const emptyOrder: OrderForm = {
  customer: "",
  email: "",
  items: 1,
  total: 0,
  status: "Pending",
};

export default function AddOrderModal({
  open,
  onClose,
  onSave,
}: AddOrderModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<OrderForm>(emptyOrder);
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const isSaved = await onSave({
      ...form,
      customer: form.customer.trim(),
      email: form.email.trim(),
    });
    setIsSaving(false);

    if (isSaved) {
      setForm(emptyOrder);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t("addOrder")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("addOrderDescription")}
            </p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.customer}
              onChange={(event) =>
                setForm({ ...form, customer: event.target.value })
              }
              placeholder={t("customerName")}
              className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder={t("email")}
              className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              required
              min="1"
              type="number"
              value={form.items}
              onChange={(event) =>
                setForm({ ...form, items: Number(event.target.value) })
              }
              placeholder={t("items")}
              className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={form.total}
              onChange={(event) =>
                setForm({ ...form, total: Number(event.target.value) })
              }
              placeholder={t("total")}
              className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value as OrderStatus })
              }
              aria-label={t("status")}
              className="rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Pending">{t("pending")}</option>
              <option value="Processing">{t("processing")}</option>
              <option value="Delivered">{t("delivered")}</option>
              <option value="Cancelled">{t("cancelled")}</option>
            </select>
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
              disabled={isSaving}
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? t("saving") : t("addOrder")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
