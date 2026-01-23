import { LoginForm } from "@/feature/auth/login-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function LoginPage() {
  await requireUnauth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
      <LoginForm />
    </div>
  );
}
