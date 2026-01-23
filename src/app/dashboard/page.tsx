import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { trpc } from "@/trpc/server";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect("/login");
  }

  const data = await trpc.getUsers();

  return (
    <div className="font-body grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          {JSON.stringify(data, null, 2)}
        </pre>
        <LogoutButton />
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
