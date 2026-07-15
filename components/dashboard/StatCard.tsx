import { LucideIcon, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-blue-100 p-3">
          <Icon
            size={24}
            className="text-blue-600"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-green-600">
        <TrendingUp size={18} />

        <span className="text-sm font-semibold">
          {change}
        </span>

        <span className="text-sm text-slate-400">
          this month
        </span>
      </div>
    </Card>
  );
}