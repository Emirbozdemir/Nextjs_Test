"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageCode, languages } from "@/lib/languages";

type Toast = { message: string; id: number } | null;

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-5 border-t border-slate-100 py-4 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [name, setName] = useState("Emir Yılmaz");
  const [email, setEmail] = useState("emir@example.com");
  const [timeZone, setTimeZone] = useState("Europe/Istanbul");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast({ message: t("saved"), id: Date.now() });
  };
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t("settings")}</h1>
        <p className="mt-1 text-slate-500">
          Manage your profile, notifications, and workspace preferences.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-6 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <a
              href="#profile"
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700"
            >
              <UserRound size={18} />
              {t("profile")}
            </a>
            <a
              href="#notifications"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Bell size={18} />
              {t("notifications")}
            </a>
            <a
              href="#preferences"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Globe2 size={18} />
              {t("preferences")}
            </a>
            <a
              href="#security"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <LockKeyhole size={18} />
              {t("security")}
            </a>
          </nav>
        </aside>
        <div className="space-y-6">
          <Card>
            <form id="profile" onSubmit={save}>
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                {t("profile")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Full name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Email
                  <input
                    value={email}
                    type="email"
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500"
                  />
                </label>
              </div>
              <div className="mt-5 flex justify-end">
                <button className="rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
                  {t("save")}
                </button>
              </div>
            </form>
          </Card>
          <Card>
            <div id="notifications" className="mb-2 flex items-center gap-3">
              <Bell className="text-violet-600" />
              <h2 className="text-xl font-bold text-slate-900">
                {t("notifications")}
              </h2>
            </div>
            <Toggle
              label="Email notifications"
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            <Toggle
              label="Order activity"
              checked={orderNotifications}
              onChange={setOrderNotifications}
            />
            <Toggle
              label="Weekly reports"
              checked={weeklyReports}
              onChange={setWeeklyReports}
            />
          </Card>
          <Card>
            <form id="preferences" onSubmit={save}>
              <div className="mb-5 flex items-center gap-3">
                <Globe2 className="text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  {t("preferences")}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  {t("language")}
                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as LanguageCode)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-500"
                  >
                    {Object.entries(languages).map(([code, item]) => (
                      <option key={code} value={code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {t("timeZone")}
                  <select
                    value={timeZone}
                    onChange={(event) => setTimeZone(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-500"
                  >
                    <option>Europe/Istanbul</option>
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                  </select>
                </label>
              </div>
              <div className="mt-5 flex justify-end">
                <button className="rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700">
                  {t("save")}
                </button>
              </div>
            </form>
          </Card>
          <Card>
            <div id="security" className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-amber-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("security")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your account secure with a strong password and two-factor
                  authentication.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {toast && (
        <div
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
