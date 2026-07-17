import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const users = [
  {
    name: "John Doe",
    email: "john@example.com",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    name: "Alex Brown",
    email: "alex@example.com",
  },
  {
    name: "Emily White",
    email: "emily@example.com",
  },
];

export default function RecentUsers() {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold">
        Recent Users
      </h2>

      <div className="space-y-5">
        {users.map((user) => (
          <div
            key={user.email}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar name={user.name} />

              <div>
                <h3 className="font-medium">
                  {user.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            <button className="rounded-lg bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200">
              View
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}