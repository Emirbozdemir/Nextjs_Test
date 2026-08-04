import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <div className="relative flex-1 overflow-y-auto p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
