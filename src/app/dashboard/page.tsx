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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Manage your workflows and test AI features.
        </p>
      </div>

      {/* AI 测试区域 */}
      <div className="w-full rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-xl font-semibold">
          Test AI (Gemini)
        </h2>
        <Button
          onClick={handleTestAi}
          disabled={testAiMutation.isPending}
          className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {testAiMutation.isPending ? "Generating..." : "Generate Recipe"}
        </Button>

        {aiResult && (
          <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 text-sm font-semibold text-primary">
              AI Response:
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {aiResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
