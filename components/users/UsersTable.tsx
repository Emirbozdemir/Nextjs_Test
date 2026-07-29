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
import { useLanguage } from "@/components/providers/LanguageProvider";
import { User } from "@/types/user";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export default function UsersTable({ users, onEdit, onDelete }: Props) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | User["status"]>("All");
  const [descending, setDescending] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const rows = useMemo(
    () =>
      users
        .filter((user) => status === "All" || user.status === status)
        .filter(
          (user) =>
            !search ||
            [user.name, user.email, user.role].some((value) =>
              value.toLowerCase().includes(search.toLowerCase()),
            ),
        )
        .sort((a, b) => a.name.localeCompare(b.name) * (descending ? -1 : 1)),
    [users, search, status, descending],
  );
  const statusColor = (value: User["status"]) =>
    value === "Active" ? "green" : value === "Pending" ? "yellow" : "red";
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
              placeholder={t("searchUsers")}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "All" | User["status"])
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="All">{t("allStatuses")}</option>
              <option value="Active">{t("active")}</option>
              <option value="Pending">{t("pending")}</option>
              <option value="Inactive">{t("inactive")}</option>
            </select>
            <button
              type="button"
              onClick={() => setDescending((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm"
            >
              <ArrowDownUp size={16} />
              {t("name")}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                <th className="pb-4">{t("name")}</th>
                <th className="pb-4">{t("role")}</th>
                <th className="pb-4">{t("status")}</th>
                <th className="pb-4 text-right">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
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
                    <Badge color={statusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      aria-label={t("edit")}
                      className="mr-2 rounded-lg bg-slate-100 p-2"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected(user)}
                      aria-label={t("delete")}
                      className="rounded-lg bg-red-100 p-2 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <p className="py-12 text-center text-slate-500">{t("noUsers")}</p>
        )}
      </Card>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex gap-4">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <TriangleAlert size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold">{t("deleteUser")}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.name}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl border px-4 py-2"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(selected.id);
                  setSelected(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-white"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
