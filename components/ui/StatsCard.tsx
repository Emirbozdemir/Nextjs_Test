import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  color: string;
  icon: LucideIcon;
};

export default function StatsCard({
  title,
  value,
  color,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
}
