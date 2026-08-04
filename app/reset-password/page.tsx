import AuthPage from "@/components/auth/AuthPage";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ token?: string }>;
}>) {
  const token = (await searchParams).token ?? "";

  return (
    <AuthPage
      eyebrow="Choose a new password"
      title="Set a new password"
      description="Use at least eight characters and include both a letter and a number."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          This reset link is invalid or incomplete. Request a new one to
          continue.
        </p>
      )}
    </AuthPage>
  );
}
