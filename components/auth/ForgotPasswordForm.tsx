"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResetLink("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result: { error?: string; resetToken?: string } =
        await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to process your request.");
        return;
      }
      if (result.resetToken)
        setResetLink(
          `/reset-password?token=${encodeURIComponent(result.resetToken)}`,
        );
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Email address
        </span>
        <span className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Mail size={18} className="text-emerald-700" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
      {resetLink && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <p className="font-bold">Development reset link created</p>
          <p className="mt-1">
            Email delivery is not configured locally. Continue with the secure
            one-hour link below.
          </p>
          <Link
            href={resetLink}
            className="mt-3 inline-flex items-center gap-1 font-bold text-emerald-800 underline"
          >
            Reset password <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Creating link..." : "Send reset link"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
