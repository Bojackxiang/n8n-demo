"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import useEnsureAuth from "@/hooks/use-ensure-auth";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/workflows");
          router.refresh();
          setIsLoading(false);
        },
        onError: (context) => {
          setIsLoading(false);
          toast.error(
            context.error.message || "Failed to sign in. Please try again.",
          );
        },
      },
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Glassmorphism Card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-xl",
          "dark:border-white/10 dark:bg-slate-900/80",
        )}
      >
        {/* Light reflection effect */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-linear-to-b from-blue-500/20 to-transparent blur-3xl" />

        <div className="relative">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-heading text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-slate-300"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={cn(
                    "pl-10 transition-colors duration-200",
                    "focus-visible:border-blue-500 focus-visible:ring-blue-500/20",
                  )}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-blue-600 transition-colors duration-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 dark:text-blue-500 dark:hover:text-blue-400"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className={cn(
                    "pl-10 transition-colors duration-200",
                    "focus-visible:border-blue-500 focus-visible:ring-blue-500/20",
                  )}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={cn(
                  "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800",
                  "dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400",
                )}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(
                "w-full cursor-pointer bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700",
                "focus-visible:ring-blue-500/50 disabled:cursor-not-allowed",
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-2 text-slate-500 backdrop-blur-xl dark:bg-slate-900/80 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full cursor-pointer transition-colors duration-200",
                "hover:bg-slate-50 dark:hover:bg-slate-800/50",
              )}
              disabled={isLoading}
            >
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 dark:text-blue-500 dark:hover:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
