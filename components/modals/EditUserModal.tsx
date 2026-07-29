"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import { User } from "@/types/user";
import { useLanguage } from "@/components/providers/LanguageProvider";

type EditUserModalProps = {
  user: User | null;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
};

export default function EditUserModal({
  user,
  onClose,
  onUpdateUser,
}: EditUserModalProps) {
  if (!user) return null;

  return (
    <EditUserForm
      key={user.id}
      user={user}
      onClose={onClose}
      onUpdateUser={onUpdateUser}
    />
  );
}

type EditUserFormProps = {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
};

function EditUserForm({ user, onClose, onUpdateUser }: EditUserFormProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<User>(user);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateUser({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t("editUser")}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("updateUser")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit user modal"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder={t("fullName")}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder={t("email")}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            required
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            placeholder={t("role")}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value as User["status"] })
            }
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Active">{t("active")}</option>
            <option value="Pending">{t("pending")}</option>
            <option value="Inactive">{t("inactive")}</option>
          </select>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
