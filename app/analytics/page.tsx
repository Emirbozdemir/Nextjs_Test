"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import StatCard from "@/components/dashboard/StatCard";
import { AnalyticsPeriod, getAnalyticsData } from "@/lib/analytics-data";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { languages } from "@/lib/languages";

const money = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function AnalyticsPage() {
  const { language, t } = useLanguage();
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const analytics = useMemo(() => getAnalyticsData(period), [period]);
  const strongestPeriod = analytics.sales.reduce((best, item) =>
    item.revenue > best.revenue ? item : best,
  );
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("analytics")}
          </h1>
          <p className="mt-1 text-slate-500">{t("analyticsDescription")}</p>
        </div>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value as AnalyticsPeriod)}
          aria-label={t("analyticsPeriod")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500"
        >
          <option value="7d">{t("period7d")}</option>
          <option value="30d">{t("period30d")}</option>
          <option value="90d">{t("period90d")}</option>
        </select>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t("revenue")}
          value={money(analytics.totalRevenue, languages[language].locale)}
          change="+12.5%"
          icon={CircleDollarSign}
        />
        <StatCard
          title={t("orders")}
          value={analytics.totalOrders.toLocaleString(
            languages[language].locale,
          )}
          change="+8.2%"
          icon={ShoppingCart}
        />
        <StatCard
          title={t("conversionRate")}
          value={`${analytics.conversionRate}%`}
          change="+0.6%"
          icon={Activity}
        />
        <StatCard
          title={t("averageOrderValue")}
          value={money(analytics.averageOrderValue, languages[language].locale)}
          change="+4.1%"
          icon={Users}
        />
      </div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-center gap-2 font-semibold">
          <ArrowUpRight size={18} />
          {t("performanceInsight")}
        </div>
        <p className="mt-1 text-blue-700">
          {t("strongestSalesPeriod")} {strongestPeriod.label}:{" "}
          {money(strongestPeriod.revenue, languages[language].locale)}.
        </p>
      </div>
      <AnalyticsCharts period={period} />
    </section>
  );
}
