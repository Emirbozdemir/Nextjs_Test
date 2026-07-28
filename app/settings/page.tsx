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

type Toast = { message: string; id: number } | null;
type ToggleProps = {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

function Toggle({ title, description, enabled, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={() => onChange(!enabled)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Emir Yılmaz");
  const [email, setEmail] = useState("emir@example.com");
  const [role, setRole] = useState("Administrator");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "English";
    return window.localStorage.getItem("adminpro-language-name") ?? "English";
  });
  const [timeZone, setTimeZone] = useState("Europe/Istanbul");
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    const languageOptions: Record<
      string,
      { locale: string; direction: "ltr" | "rtl" }
    > = {
      English: { locale: "en", direction: "ltr" },
      Türkçe: { locale: "tr", direction: "ltr" },
      العربية: { locale: "ar", direction: "rtl" },
      Français: { locale: "fr", direction: "ltr" },
      Русский: { locale: "ru", direction: "ltr" },
    };
    const selectedLanguage =
      languageOptions[language] ?? languageOptions.English;
    window.localStorage.setItem("adminpro-language-name", language);
    document.documentElement.lang = selectedLanguage.locale;
    document.documentElement.dir = selectedLanguage.direction;
  }, [language]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  const showToast = (message: string) => setToast({ message, id: Date.now() });
  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("Profile settings saved.");
  };
  const handlePreferencesSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("Preferences saved.");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">
          Manage your profile, notifications, and workspace preferences.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-0 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <a
              href="#profile"
              className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700"
            >
              <UserRound size={18} />
              Profile
            </a>
            <a
              href="#notifications"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Bell size={18} />
              Notifications
            </a>
            <a
              href="#preferences"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Globe2 size={18} />
              Preferences
            </a>
            <a
              href="#security"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <LockKeyhole size={18} />
              Security
            </a>
          </nav>
        </aside>
        <div className="space-y-6">
          <Card className="scroll-mt-6">
            <form id="profile" onSubmit={handleProfileSave}>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  EY
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Profile</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update your personal account information.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Full name
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Email address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Role
                  <input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </Card>
          <Card className="scroll-mt-6">
            <div id="notifications" className="mb-2 flex items-start gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Notifications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the updates you want to receive.
                </p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              <Toggle
                title="Email notifications"
                description="Receive account and product updates by email."
                enabled={emailNotifications}
                onChange={setEmailNotifications}
              />
              <Toggle
                title="Order activity"
                description="Get notified when a new order is placed or updated."
                enabled={orderNotifications}
                onChange={setOrderNotifications}
              />
              <Toggle
                title="Weekly reports"
                description="Receive a weekly performance summary every Monday."
                enabled={weeklyReports}
                onChange={setWeeklyReports}
              />
            </div>
          </Card>
          <Card className="scroll-mt-6">
            <form id="preferences" onSubmit={handlePreferencesSave}>
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                  <Globe2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Preferences
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Set your workspace language and time zone.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Language
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="English">English</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="العربية">العربية</option>
                    <option value="Français">Français</option>
                    <option value="Русский">Русский</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Time zone
                  <select
                    value={timeZone}
                    onChange={(event) => setTimeZone(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Europe/Istanbul</option>
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                  </select>
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </Card>
          <Card className="scroll-mt-6">
            <div
              id="security"
              className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex gap-3">
                <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Security</h2>
                  <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                    Keep your account secure with a strong password and
                    two-factor authentication.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    showToast("Password reset link sent to your email.")
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Two-factor authentication setup will be available soon.",
                    )
                  }
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
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
