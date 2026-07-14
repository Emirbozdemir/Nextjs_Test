import StatCard from "@/components/dashboard/StatCard";
import {
  Users,
  DollarSign,
  ShoppingCart,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Welcome back, Emir 👋
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value="1,245"
          change="+12%"
          icon={Users}
        />

        <StatCard
          title="Revenue"
          value="$52,410"
          change="+8%"
          icon={DollarSign}
        />

        <StatCard
          title="Orders"
          value="845"
          change="+3%"
          icon={ShoppingCart}
        />

        <StatCard
          title="Rating"
          value="4.9"
          change="+0.2"
          icon={Star}
        />
      </div>
    </section>
  );
}