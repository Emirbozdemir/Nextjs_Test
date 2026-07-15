import Card from "@/components/ui/Card";

export default function RevenueCard() {
  return (
    <Card className="h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900">
        Revenue
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Current month
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500">
            Total Revenue
          </p>

          <h3 className="text-4xl font-bold text-slate-900">
            $52,410
          </h3>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-green-700">
            ▲ 18% compared to last month
          </p>
        </div>
      </div>
    </Card>
  );
}