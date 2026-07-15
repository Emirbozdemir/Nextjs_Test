import Card from "@/components/ui/Card";

export default function SalesOverview() {
  return (
    <Card className="h-[350px]">
      <div className="flex h-full flex-col">
        <h2 className="text-lg font-semibold text-slate-900">
          Sales Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly sales performance
        </p>

        <div className="mt-6 flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200">
          <span className="text-slate-400">
            📈 Chart gelecek
          </span>
        </div>
      </div>
    </Card>
  );
}