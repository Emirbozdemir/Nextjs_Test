"use client";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddUserModal({
  open,
  onClose,
}: AddUserModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Add User
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <input
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <select className="w-full rounded-xl border border-slate-200 p-3">
            <option>Administrator</option>
            <option>Manager</option>
            <option>User</option>
          </select>

          <select className="w-full rounded-xl border border-slate-200 p-3">
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3"
          >
            Cancel
          </button>

          <button className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
            Save User
          </button>
        </div>
      </div>
    </div>
  );
}