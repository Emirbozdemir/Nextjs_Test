import { redirect } from "next/navigation";

import AuthPage from "@/components/auth/AuthPage";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { getCurrentUser } from "@/lib/auth";

export default async function ForgotPasswordPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <AuthPage
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your email and we will prepare a secure, time-limited reset link."
    >
      <ForgotPasswordForm />
    </AuthPage>
  );
}
