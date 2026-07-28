import Card from "@/components/ui/Card";

const activities = [
  { title: "New user registered", time: "5 minutes ago", color: "bg-blue-600" },
  { title: "Order #1048 completed", time: "28 minutes ago", color: "bg-emerald-600" },
  { title: "Product inventory updated", time: "2 hours ago", color: "bg-violet-600" },
  { title: "Monthly report generated", time: "Yesterday", color: "bg-amber-500" },
];

export default function ActivityTimeline() {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold">
        Activity
      </h2>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.title}
            className="flex items-start gap-3"
          >
            <div className={`mt-2 h-3 w-3 rounded-full ${activity.color}`} />

            <div><p className="text-sm font-medium text-slate-700">{activity.title}</p><p className="mt-1 text-xs text-slate-400">{activity.time}</p></div>
          </div>
        ))}
      </div>
    </Card>
  );
}
