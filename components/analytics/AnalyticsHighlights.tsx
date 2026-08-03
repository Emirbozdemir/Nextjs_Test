import { CalendarDays, PackageCheck, Trophy } from "lucide-react";

import Card from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { languages } from "@/lib/languages";

type SalesPoint = { label: string; revenue: number; orders: number };
type CategoryPoint = { name: string; share: number; revenue: number };

type AnalyticsHighlightsProps = {
  sales: SalesPoint[];
  categoryData: CategoryPoint[];
};

export default function AnalyticsHighlights({
  sales,
  categoryData,
}: AnalyticsHighlightsProps) {
  const { language, t } = useLanguage();
  const formatMoney = (value: number) =>
    new Intl.NumberFormat(languages[language].locale, {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  const topCategory = categoryData.reduce((best, item) =>
    item.revenue > best.revenue ? item : best,
  );
  const bestSalesDay = sales.reduce((best, item) =>
    item.revenue > best.revenue ? item : best,
  );
  const averageOrders = Math.round(
    sales.reduce((total, item) => total + item.orders, 0) / sales.length,
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Highlight
        icon={Trophy}
        color="bg-amber-100 text-amber-600"
        label={t("topCategory")}
        value={topCategory.name}
        detail={`${topCategory.share}% · ${formatMoney(topCategory.revenue)}`}
      />
      <Highlight
        icon={CalendarDays}
        color="bg-blue-100 text-blue-600"
        label={t("peakSalesPeriod")}
        value={bestSalesDay.label}
        detail={formatMoney(bestSalesDay.revenue)}
      />
      <Highlight
        icon={PackageCheck}
        color="bg-emerald-100 text-emerald-600"
        label={t("averageOrderPace")}
        value={averageOrders.toLocaleString(languages[language].locale)}
        detail={t("ordersPerPeriod")}
      />
    </div>
  );
}

function Highlight({
  icon: Icon,
  color,
  label,
  value,
  detail,
}: {
  icon: typeof Trophy;
  color: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
