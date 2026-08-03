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
  ChevronRight,
  Settings,
} from "lucide-react";

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
    <aside className="relative flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-emerald-950/20 bg-[#17352e] text-emerald-50 shadow-2xl shadow-emerald-950/25">
      <div className="pointer-events-none absolute -left-24 -top-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" />
      <div className="relative border-b border-white/10 p-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-orange-300 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/30 ring-1 ring-white/30">
          A
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Admin<span className="text-orange-300">Pro</span>
        </h1>

        <p className="mt-1 text-sm text-slate-400">{t("managementSystem")}</p>
      </div>

      <nav className="relative flex-1 space-y-1.5 p-4">
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
                "group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-emerald-950 shadow-lg shadow-emerald-950/30 ring-1 ring-white/20"
                  : "text-emerald-100/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon
                size={20}
                className={clsx(
                  "transition duration-200 group-hover:scale-110",
                  isActive
                    ? "text-emerald-950"
                    : "text-emerald-200/60 group-hover:text-orange-200",
                )}
              />

              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-white/10 p-5">
        <Link
          href="/settings"
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-0.5 hover:border-orange-200/30 hover:bg-white/10"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-orange-300 font-bold text-emerald-950 shadow-lg shadow-emerald-950/20">
            EB
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">Emir</p>

            <p className="text-sm text-slate-400">Administrator</p>
          </div>
          <ChevronRight
            size={18}
            className="text-emerald-100/50 transition group-hover:translate-x-0.5 group-hover:text-orange-200"
          />
        </Link>
      </div>
    </aside>
  );
}
