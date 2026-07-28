"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLanguage } from "@/components/providers/LanguageProvider";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Users",
    icon: Users,
    href: "/users",
  },
  {
    title: "Products",
    icon: Package,
    href: "/products",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    title: "Analytics",
    icon: ChartNoAxesCombined,
    href: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const menuItems = [
    { title: t("dashboard"), icon: LayoutDashboard, href: "/" },
    { title: t("users"), icon: Users, href: "/users" },
    { title: t("products"), icon: Package, href: "/products" },
    { title: t("orders"), icon: ShoppingCart, href: "/orders" },
    { title: t("analytics"), icon: ChartNoAxesCombined, href: "/analytics" },
    { title: t("settings"), icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 shadow-2xl shadow-slate-900/20">
      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-black text-white shadow-lg shadow-indigo-500/30">A</div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Admin<span className="text-cyan-400">Pro</span>
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Management System
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1.5 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.title}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-950/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 font-bold text-white shadow-lg shadow-indigo-500/20">
            EB
          </div>

          <div>
            <p className="font-semibold text-white">
              Emir
            </p>

            <p className="text-sm text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
