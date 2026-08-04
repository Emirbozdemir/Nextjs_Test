import { redirect } from "next/navigation";

import AuthPage from "@/components/auth/AuthPage";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <AuthPage
      eyebrow="Create account"
      title="Start with AdminPro"
      description="Create your workspace account with a strong password. You can start managing your dashboard immediately."
    >
      <RegisterForm />
    </AuthPage>
  );
}
