"use client";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddUserModal({
  open,
  onClose,
}: AddUserModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Add User
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <input
            type="text"
            placeholder="Role"
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <select className="w-full rounded-xl border border-slate-200 p-3">
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}