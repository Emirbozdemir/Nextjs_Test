"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import { User } from "@/types/user";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<User, "id">) => void;
};

const emptyForm = {
  name: "",
  email: "",
  role: "User",
  status: "Active" as User["status"],
};

export default function AddUserModal({
  open,
  onClose,
  onAddUser,
}: AddUserModalProps) {
  const [form, setForm] = useState(emptyForm);

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAddUser({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
    });

    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add User</h2>
            <p className="mt-1 text-sm text-slate-500">Create a new dashboard user.</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close add user modal"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full Name" className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Role" className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as User["status"] })} className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={handleClose} className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
}
