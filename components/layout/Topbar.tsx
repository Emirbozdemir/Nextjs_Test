"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Moon,
  Package,
  LogOut,
  Search,
  ShoppingCart,
  Settings,
  Sun,
  UserCircle2,
  Users,
  X,
} from "lucide-react";

import { initialOrders } from "@/data/orders";
import { initialProducts } from "@/data/products";
import { initialUsers } from "@/data/user";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { AuthUser } from "@/lib/auth";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "User" | "Product" | "Order";
};

const notifications = [
  {
    id: 1,
    title: "notificationOrderTitle",
    description: "notificationOrderDescription",
    time: "notificationOrderTime",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "notificationStockTitle",
    description: "notificationStockDescription",
    time: "notificationStockTime",
    color: "bg-amber-500",
  },
  {
    id: 3,
    title: "notificationReportTitle",
    description: "notificationReportDescription",
    time: "notificationReportTime",
    color: "bg-emerald-500",
  },
];

export default function Topbar({ user }: { user: AuthUser }) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications.length,
  );
  const results = useMemo<SearchResult[]>(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const users = initialUsers
      .filter((user) =>
        [user.name, user.email, user.role].some((item) =>
          item.toLowerCase().includes(value),
        ),
      )
      .map((user) => ({
        id: `user-${user.id}`,
        title: user.name,
        description: `${user.role} · ${user.email}`,
        href: "/users",
        type: "User" as const,
      }));
    const products = initialProducts
      .filter((product) =>
        [product.name, product.category].some((item) =>
          item.toLowerCase().includes(value),
        ),
      )
      .map((product) => ({
        id: `product-${product.id}`,
        title: product.name,
        description: `${product.category} · ${product.stock} in stock`,
        href: "/products",
        type: "Product" as const,
      }));
    const orders = initialOrders
      .filter((order) =>
        [order.customer, order.email, order.id.toString()].some((item) =>
          item.toLowerCase().includes(value),
        ),
      )
      .map((order) => ({
        id: `order-${order.id}`,
        title: `Order #${order.id}`,
        description: `${order.customer} · ${order.status}`,
        href: "/orders",
        type: "Order" as const,
      }));
    return [...users, ...products, ...orders].slice(0, 6);
  }, [query]);

  const iconFor = (type: SearchResult["type"]) =>
    type === "User" ? Users : type === "Product" ? Package : ShoppingCart;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-stone-200/80 bg-[#fffefb]/70 px-4 shadow-[0_8px_30px_-24px_rgba(41,54,47,0.2)] backdrop-blur-2xl sm:px-7">
      <h2 className="hidden text-xl font-bold tracking-tight text-slate-900 md:block">
        Dashboard overview
      </h2>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <div className="flex w-44 items-center gap-2 rounded-2xl border border-stone-200/80 bg-white/75 px-3 py-2.5 shadow-sm shadow-stone-200/50 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 sm:w-72">
            <Search size={18} className="shrink-0 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search users, products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {query && (
            <div className="absolute right-0 top-14 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
              <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Search results
              </div>
              {results.length ? (
                <div className="p-2">
                  {results.map((result) => {
                    const Icon = iconFor(result.type);
                    return (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-indigo-50"
                      >
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {result.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {result.description}
                          </p>
                        </div>
                        <span className="ml-auto text-xs text-slate-400">
                          {result.type}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No matches found for “{query}”.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((current) => !current);
              setIsProfileOpen(false);
            }}
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
            className="relative rounded-2xl border border-stone-200/80 bg-white/90 p-2.5 text-slate-600 shadow-sm shadow-stone-200/70 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 top-14 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {t("notifications")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {unreadNotifications} {t("unreadUpdates")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUnreadNotifications(0)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <CheckCheck size={15} />
                  {t("markAllRead")}
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex gap-3 px-4 py-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${notification.color}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {t(notification.title)}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {t(notification.description)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {t(notification.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={theme === "dark"}
          aria-label={t("darkMode")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="inline-flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white/90 p-2.5 text-slate-600 shadow-sm shadow-stone-200/70 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-50 hover:text-emerald-700"
        >
          {theme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
          <span
            className={`relative hidden h-5 w-9 rounded-full transition sm:block ${theme === "dark" ? "bg-emerald-600" : "bg-slate-200"}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${theme === "dark" ? "left-4" : "left-0.5"}`}
            />
          </span>
        </button>
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((current) => !current);
              setIsNotificationsOpen(false);
            }}
            aria-expanded={isProfileOpen}
            aria-label={t("profile")}
            className="flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white/85 px-2.5 py-1.5 text-left shadow-sm shadow-stone-200/70 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50"
          >
            <UserCircle2
              size={32}
              className="text-emerald-700 drop-shadow-sm"
            />
            <div>
              <p className="max-w-28 truncate font-medium text-slate-800">{user.name}</p>
              <p className="max-w-28 truncate text-xs text-slate-500">{user.role}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl shadow-stone-900/15">
              <div className="border-b border-stone-100 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Settings size={17} />
                {t("settings")}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
