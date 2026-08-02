import Card from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Order, OrderStatus } from "@/types/order";

type OrderStatusOverviewProps = { orders: Order[] };

const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled",
];

const colors: Record<OrderStatus, string> = {
  Pending: "bg-amber-400",
  Processing: "bg-blue-500",
  Delivered: "bg-emerald-500",
  Cancelled: "bg-rose-500",
};

export default function OrderStatusOverview({
  orders,
}: OrderStatusOverviewProps) {
  const { t } = useLanguage();
  const total = orders.length;
  const count = (status: OrderStatus) =>
    orders.filter((order) => order.status === status).length;
  const percentage = (status: OrderStatus) =>
    total === 0 ? 0 : Math.round((count(status) / total) * 100);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t("orderStatusOverview")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("orderStatusOverviewDescription")}
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
          {total}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {statuses.map((status) => (
          <div key={status}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {t(`orderStatus${status}`)}
              </span>
              <span className="text-slate-500">
                {count(status)} · {percentage(status)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${colors[status]}`}
                style={{ width: `${percentage(status)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
        <Metric label={t("deliveryRate")} value={percentage("Delivered")} />
        <Metric label={t("cancellationRate")} value={percentage("Cancelled")} />
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}%</p>
    </div>
  );
}
