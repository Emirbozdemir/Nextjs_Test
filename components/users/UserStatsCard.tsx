import { LucideIcon } from "lucide-react";

interface UserStatsCardProps {
  title: string;
  value: string;
  color: string;
  icon: LucideIcon;
}

export default function UserStatsCard({
  title,
  value,
  color,
  icon: Icon,
}: UserStatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="text-white" size={22} />
        </div>
      </div>
    </div>
  );
}