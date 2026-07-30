import { useLanguage } from "@/components/providers/LanguageProvider";
import Card from "@/components/ui/Card";

export default function RevenueCard() {
  const { t } = useLanguage();

  return (
    <Card className="h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900">{t("revenue")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("currentMonth")}</p>

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500">{t("totalRevenue")}</p>
          <h3 className="text-4xl font-bold text-slate-900">$52,410</h3>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-green-700">▲ {t("revenueComparison")}</p>
        </div>
      </div>
    </Card>
  );
}
