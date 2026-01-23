import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          {/* Light reflection effect */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl" />

          <div className="relative">
            {/* 404 Text */}
            <h1 className="mb-4 font-heading text-6xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              404
            </h1>

            {/* Message */}
            <h2 className="mb-2 font-heading text-2xl font-semibold text-slate-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="mb-8 text-slate-600 dark:text-slate-400">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Button */}
            <Link href="/">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 dark:from-blue-500 dark:to-blue-600"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
