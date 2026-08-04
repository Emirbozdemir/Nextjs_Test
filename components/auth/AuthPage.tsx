import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function AuthPage({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f5ee] px-5 py-10">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-emerald-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl" />
      <section className="relative w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/85 p-7 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-10">
        <Link
          href="/login"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"
        >
          <ArrowLeft size={17} /> Back to sign in
        </Link>
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
          <ShieldCheck size={24} />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
