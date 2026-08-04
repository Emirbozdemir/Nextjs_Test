import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles } from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f5ee] px-5 py-10">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-emerald-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl" />
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden min-h-[620px] flex-col justify-between bg-[#17352e] p-10 text-white md:flex">
          <div>
            <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-300 to-orange-200 text-xl font-black text-emerald-950">
              A
            </div>
            <p className="text-3xl font-bold tracking-tight">
              Admin<span className="text-orange-300">Pro</span>
            </p>
            <h1 className="mt-20 max-w-sm text-4xl font-bold leading-tight">
              Everything important, in one calm workspace.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-emerald-100/70">
              Manage people, products and orders with a focused view of your
              business.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-100/80">
            <ShieldCheck size={20} className="text-emerald-300" />
            Secure, database-backed access
          </div>
        </div>
        <div className="flex min-h-[620px] items-center p-6 sm:p-12">
          <div className="w-full">
            <div className="mb-9">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-800 md:hidden">
                <Sparkles size={14} /> AdminPro
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to your dashboard
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Use the administrator credentials created with your database
                setup.
              </p>
            </div>
            <LoginForm />
            <p className="mt-7 text-center text-xs leading-5 text-slate-400">
              Your session is protected with an httpOnly cookie and expires
              automatically after seven days.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
