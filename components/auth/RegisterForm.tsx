"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to create your account.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400";
  const fieldClass =
    "flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Full name
        </span>
        <span className={fieldClass}>
          <UserRound size={18} className="text-emerald-700" />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Email address
        </span>
        <span className={fieldClass}>
          <Mail size={18} className="text-emerald-700" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className={inputClass}
          />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </span>
        <span className={fieldClass}>
          <LockKeyhole size={18} className="text-emerald-700" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="text-slate-400 transition hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Confirm password
        </span>
        <span className={fieldClass}>
          <LockKeyhole size={18} className="text-emerald-700" />
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Repeat your password"
            className={inputClass}
          />
        </span>
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
        <ArrowRight size={18} />
      </button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-700 hover:text-emerald-900"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
