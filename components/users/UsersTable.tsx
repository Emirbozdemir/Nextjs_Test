"use client";

import { useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

import {
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

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

export default function UsersTable() {
  const [search, setSearch] = useState("");

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  return (
    <Card>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Users List
          </h2>

          <p className="text-sm text-slate-500">
            {users.length} users • {activeUsers} active
          </p>
        </div>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user..."
            className="w-80 rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="pb-4">User</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-100 transition hover:bg-slate-50"
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

              <td>
                <Badge color="blue">
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
                  <button className="rounded-lg bg-slate-100 p-2 transition hover:bg-slate-200">
                    <Pencil size={18} />
                  </button>

                  <button className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </p>

        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Previous
          </button>

          <button className="rounded-lg bg-blue-600 px-3 py-2 text-white">
            1
          </button>

          <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}