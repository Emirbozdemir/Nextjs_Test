"use client";

import Link from "next/link";
import { DollarSign, ShoppingCart, Star, Users } from "lucide-react";

import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RecentUsers from "@/components/dashboard/RecentUsers";
import RevenueCard from "@/components/dashboard/RevenueCard";
import SalesOverview from "@/components/dashboard/SalesOverview";
import StatCard from "@/components/dashboard/StatCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("dashboard")}</h1>
          <p className="mt-1 text-slate-500">Welcome back, Emir.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/users"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            {t("newUser")}
          </Link>
          <Link
            href="/analytics"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {t("viewReports")}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t("users")} value="1,245" change="+12%" icon={Users} />
        <StatCard
          title={t("revenue")}
          value="$52,410"
          change="+8%"
          icon={DollarSign}
        />
        <StatCard title={t("orders")} value="845" change="+3%" icon={ShoppingCart} />
        <StatCard title="Rating" value="4.9" change="+0.2" icon={Star} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesOverview />
        </div>
        <RevenueCard />
      </div>
      <RecentOrders />
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentUsers />
        <ActivityTimeline />
      </div>
    </section>
  );
}
