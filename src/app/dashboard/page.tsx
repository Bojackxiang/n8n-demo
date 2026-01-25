"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

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
  const [aiResult, setAiResult] = useState<string>("");

  const createWorkflow = trpc.createWorkflow.useMutation({
    onSuccess: () => {
      utils.getWorkflows.invalidate();
    },
  });

  const testAiMutation = trpc.testAi.useMutation({
    onSuccess: (data) => {
      setAiResult(data.text || "No response");
      console.log("AI Response:", data.text);
    },
    onError: (error) => {
      console.error("AI test failed:", error);
      setAiResult(`Error: ${error.message}`);
    },
  });

  const _handleCreateWorkflow = () => {
    createWorkflow.mutate({
      name: `Workflow ${new Date().toLocaleTimeString()}`,
      description: "This is a sample workflow created from dashboard",
    });
  };

  const handleTestAi = () => {
    testAiMutation.mutate();
  };

  return (
    <div className="font-body grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        {/* AI 测试区域 */}
        <div className="w-full max-w-2xl rounded-lg border border-blue-500/30 bg-slate-50 p-4 dark:bg-slate-800">
          <h2 className="mb-3 font-semibold">Test AI (Gemini)</h2>
          <Button
            onClick={handleTestAi}
            disabled={testAiMutation.isPending}
            className="mb-3 bg-purple-500 hover:bg-purple-600"
          >
            {testAiMutation.isPending ? "Generating..." : "Generate Recipe"}
          </Button>

          {aiResult && (
            <div className="mt-3 max-h-96 overflow-y-auto rounded border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900">
              <p className="mb-2 text-sm font-semibold text-blue-600">
                AI Response:
              </p>
              <p className="whitespace-pre-wrap text-sm">{aiResult}</p>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
