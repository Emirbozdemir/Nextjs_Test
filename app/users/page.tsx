"use client";
import { useState } from "react";
import AddUserModal from "@/components/users/AddUserModal";
import UsersTable from "@/components/users/UsersTable";
import UserStatsCard from "@/components/users/UserStatsCard";

import {
  Users,
  UserCheck,
  Clock3,
} from "lucide-react";

export default function UsersPage() {
    const [open, setOpen] = useState(false);

    return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Users
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all system users
          </p>
        </div>

        <button
  onClick={() => setOpen(true)}
  className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
>
  + Add User
</button>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <UserStatsCard
          title="Total Users"
          value="1,245"
          color="bg-blue-600"
          icon={Users}
        />

        <UserStatsCard
          title="Active Users"
          value="1,082"
          color="bg-green-600"
          icon={UserCheck}
        />

        <UserStatsCard
          title="Pending Users"
          value="163"
          color="bg-yellow-500"
          icon={Clock3}
        />
      </div>

      {/* Users Table */}
      <UsersTable />
      <AddUserModal
  open={open}
  onClose={() => setOpen(false)}
/>
    </section>
  );
}