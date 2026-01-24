"use client";

// import { headers } from "next/headers";
import { LogoutButton } from "@/components/logout-button";
import useClientAuthRedirect from "@/hooks/use-client-auth";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";

export default function DashboardPage() {
  // const headersList = await headers();
  // const session = await auth.api.getSession({ headers: headersList });

  // if (!session) {
  //   redirect("/login");
  // }

  // const data = await trpc.getUsers();
  // useClientAuthRedirect();
  const { data, isLoading } = trpc.getWorkflows.useQuery();
  const utils = trpc.useUtils();
  const createWorkflow = trpc.createWorkflow.useMutation({
    onSuccess: () => {
      utils.getWorkflows.invalidate();
    },
  });

  const handleCreateWorkflow = () => {
    createWorkflow.mutate({
      name: `Workflow ${new Date().toLocaleTimeString()}`,
      description: "This is a sample workflow created from dashboard",
    });
  };

  return (
    <div className="font-body grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        {/* 显示工作流列表 */}
        <div className="w-full max-w-2xl space-y-2">
          {isLoading && <p>Loading workflows...</p>}
          {data && data.length === 0 && <p>No workflows yet. Create one!</p>}
          {data?.map((workflow) => (
            <div
              key={workflow.id}
              className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="font-semibold">{workflow.name}</h3>
              {workflow.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {workflow.description}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                Created: {new Date(workflow.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <Button
          disabled={createWorkflow.isPending}
          onClick={handleCreateWorkflow}
        >
          {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
        </Button>
        <LogoutButton />
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
