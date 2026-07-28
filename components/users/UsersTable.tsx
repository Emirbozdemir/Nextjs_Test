"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  Pencil,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { User } from "@/types/user";

type StatusFilter = "All" | User["status"];
type SortDirection = "asc" | "desc";

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export default function UsersTable({
  users,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users
      .filter((user) => statusFilter === "All" || user.status === statusFilter)
      .filter(
        (user) =>
          !query ||
          [user.name, user.email, user.role].some((value) =>
            value.toLowerCase().includes(query),
          ),
      )
      .sort(
        (first, second) =>
          first.name.localeCompare(second.name) *
          (sortDirection === "asc" ? 1 : -1),
      );
  }, [users, search, statusFilter, sortDirection]);

  const confirmDelete = () => {
    if (!userToDelete) return;
    onDelete(userToDelete.id);
    setUserToDelete(null);
  };

  return (
    <>
      <Card>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or role..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              aria-label="Filter users by status"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              type="button"
              onClick={() =>
                setSortDirection((current) =>
                  current === "asc" ? "desc" : "asc",
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowDownUp size={16} />
              Name: {sortDirection === "asc" ? "A–Z" : "Z–A"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
                <th className="pb-4">Name</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Action</th>
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
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge color="blue">{user.role}</Badge>
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
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        aria-label={`Edit ${user.name}`}
                        className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserToDelete(user)}
                        aria-label={`Delete ${user.name}`}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-14 text-center">
            <p className="font-semibold text-slate-700">No users found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </Card>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex gap-4">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <TriangleAlert size={22} />
              </div>
              <div>
                <h2
                  id="delete-user-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Delete user?
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  This will permanently remove{" "}
                  <span className="font-semibold text-slate-700">
                    {userToDelete.name}
                  </span>{" "}
                  from this dashboard.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
