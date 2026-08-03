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
    <div className="group relative overflow-hidden rounded-[1.6rem] border border-stone-200/80 bg-[#fffefb]/90 p-6 shadow-[0_16px_40px_-26px_rgba(41,54,47,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-26px_rgba(13,148,136,0.22)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-100/80 blur-2xl transition duration-300 group-hover:scale-150" />
      <div className="flex items-center justify-between">
        <div className="relative">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
        </div>

        <div
          className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${color}`}
        >
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
}
