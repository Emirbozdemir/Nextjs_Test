"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, UserCheck, Users } from "lucide-react";

import AddUserModal from "@/components/modals/AddUserModal";
import EditUserModal from "@/components/modals/EditUserModal";
import UsersTable from "@/components/users/UsersTable";
import StatsCard from "@/components/ui/StatsCard";
import { initialUsers } from "@/data/user";
import { User } from "@/types/user";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Toast = { message: string; id: number } | null;

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch("/api/users", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load users.");
        setUsers(await response.json());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setUsers(initialUsers);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadUsers();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = (message: string) => setToast({ message, id: Date.now() });

  const handleAddUser = (newUser: Omit<User, "id">) => {
    setUsers((currentUsers) => [
      ...currentUsers,
      {
        ...newUser,
        id: Math.max(0, ...currentUsers.map((user) => user.id)) + 1,
      },
    ]);
    showToast("User added successfully.");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );
    showToast("User details updated.");
  };

  const handleDeleteUser = (id: number) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    showToast("User deleted successfully.");
  };

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const pendingUsers = users.filter((user) => user.status === "Pending").length;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("users")}</h1>
          <p className="mt-1 text-slate-500">{t("manageUsers")}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + {t("addUser")}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title={t("totalUsers")}
          value={users.length.toString()}
          color="bg-blue-600"
          icon={Users}
        />
        <StatsCard
          title={t("activeUsers")}
          value={activeUsers.toString()}
          color="bg-green-600"
          icon={UserCheck}
        />
        <StatsCard
          title={t("pendingUsers")}
          value={pendingUsers.toString()}
          color="bg-yellow-500"
          icon={Clock3}
        />
      </div>

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
      ) : (
        <UsersTable
          users={users}
          onEdit={setUserBeingEdited}
          onDelete={handleDeleteUser}
        />
      )}

      <AddUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <EditUserModal
        user={userBeingEdited}
        onClose={() => setUserBeingEdited(null)}
        onUpdateUser={handleUpdateUser}
      />

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toast.message}
        </div>
      )}
    </section>
  );
}
