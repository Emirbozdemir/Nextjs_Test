import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Administrator",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
  },
  {
    id: 3,
    name: "Alex Brown",
    email: "alex@example.com",
    role: "Editor",
  },
  {
    id: 4,
    name: "Emily White",
    email: "emily@example.com",
    role: "Support",
  },
];

export default function RecentUsers() {
  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>

        <Link
          href="/users"
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-100"
        >
          View All
        </Link>
      </div>

      <div className="space-y-5">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} />

              <div>
                <h3 className="font-semibold text-slate-800">{user.name}</h3>

                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{user.role}</p>

              <Link
                href="/users"
                className="mt-1 text-sm text-blue-600 hover:underline"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
