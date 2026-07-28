"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, CircleDollarSign, ShoppingCart, Users } from "lucide-react";

import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import StatCard from "@/components/dashboard/StatCard";
import { AnalyticsPeriod, getAnalyticsData } from "@/lib/analytics-data";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(value);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const analytics = useMemo(() => getAnalyticsData(period), [period]);
  return <section className="space-y-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-slate-900">Analytics</h1><p className="mt-1 text-slate-500">Monitor your store&apos;s revenue and customer performance.</p></div><select value={period} onChange={(event) => setPeriod(event.target.value as AnalyticsPeriod)} aria-label="Select analytics period" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500"><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option></select></div><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"><StatCard title="Revenue" value={money(analytics.totalRevenue)} change="+12.5%" icon={CircleDollarSign} /><StatCard title="Orders" value={analytics.totalOrders.toLocaleString()} change="+8.2%" icon={ShoppingCart} /><StatCard title="Conversion Rate" value={`${analytics.conversionRate}%`} change="+0.6%" icon={Activity} /><StatCard title="Avg. Order Value" value={money(analytics.averageOrderValue)} change="+4.1%" icon={Users} /></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800"><div className="flex items-center gap-2 font-semibold"><ArrowUpRight size={18} />Performance insight</div><p className="mt-1 text-blue-700">Revenue is trending upward in the selected period, led by laptop and phone purchases.</p></div><AnalyticsCharts period={period} /></section>;
}
