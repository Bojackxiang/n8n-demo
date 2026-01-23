import { LogoutButton } from "@/components/logout-button";
import { requireAuth } from "@/lib/auth-utils";
import { trpc } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  await requireAuth();

  const data = await trpc.getUsers();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <pre className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          {JSON.stringify(data, null, 2)}
        </pre>
        <LogoutButton />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
