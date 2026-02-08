"use client";

import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/feature/workflows/hooks/use-workflow";
import { FlaskConicalIcon, LoaderCircle } from "lucide-react";

const ExecuteWorkFlowButton = (props: { workflowId: string }) => {
  const { mutate, isPending } = useExecuteWorkflow();

  return (
    <Button
      onClick={() => mutate({ id: props.workflowId })}
      disabled={isPending}
      className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <FlaskConicalIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
        )}
        <span className="font-medium">
          {isPending ? "Executing..." : "Execute Workflow"}
        </span>
      </div>
    </Button>
  );
};

export default ExecuteWorkFlowButton;
