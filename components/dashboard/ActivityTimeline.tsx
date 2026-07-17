import Card from "@/components/ui/Card";

const activities = [
  "New user registered",
  "Order #1004 completed",
  "Product updated",
  "Monthly report generated",
];

export default function ActivityTimeline() {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold">
        Activity
      </h2>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

            <p className="text-sm text-slate-600">
              {activity}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}