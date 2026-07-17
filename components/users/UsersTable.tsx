import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { Pencil, Trash2 } from "lucide-react";
import { Search } from "lucide-react";
import Badge from "@/components/ui/Badge";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Administrator",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Brown",
    email: "alex@example.com",
    role: "User",
    status: "Pending",
  },
  {
    id: 4,
    name: "Emily White",
    email: "emily@example.com",
    role: "Support",
    status: "Inactive",
  },
];

const activeUsers = users.filter(
  (user) => user.status === "Active"
).length;

export default function UsersTable() {
  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
  <div className="relative">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      placeholder="Search user..."
      className="w-80 rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
    />
  </div>

  <button className="rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-100">
    Filter
  </button>
</div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="pb-4">Name</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-100"
            >
              <td className="py-5">
  <div className="flex items-center gap-3">
    <Avatar name={user.name} />

    <div>
      <p className="font-semibold text-slate-800">
        {user.name}
      </p>

      <p className="text-sm text-slate-500">
        {user.email}
      </p>
    </div>
  </div>
</td>

              

              <td><Badge color="blue">
    {user.role}
  </Badge>
  </td>

              <td>
                <Badge
  color={
    user.status === "Active"
      ? "green"
      : user.status === "Pending"
      ? "yellow"
      : "red"
  }
>
  {user.status}
</Badge>
              </td>

            <td className="text-right">
  <div className="flex justify-end gap-2">
    <button className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200">
      <Pencil size={18} />
    </button>

    <button className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200">
      <Trash2 size={18} />
    </button>
  </div>
</td>  
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}