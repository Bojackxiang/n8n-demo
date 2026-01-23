import { RegisterForm } from "@/feature/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
      <RegisterForm />
    </div>
  );
}
