import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import React from "react";
import { useCreateNewWorkflow } from "../hooks/use-workflow";
import { useProUpgradeDialog } from "@/components/pro-required-alert";

const NewWorkflowButton = () => {
  const createWorkflow = useCreateNewWorkflow();

  const { checkProAlert, ProUpgradeDialog } = useProUpgradeDialog(
    "unlimited workflows",
    () => createWorkflow.mutate(),
  );

  return (
    <>
      <Button
        size="default"
        onClick={() => checkProAlert()}
        disabled={createWorkflow.isPending}
        className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Content */}
        <div className="relative flex items-center gap-2">
          {createWorkflow.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          )}
          <span className="font-medium">
            {createWorkflow.isPending ? "Creating..." : "New Workflow"}
          </span>
          {!createWorkflow.isPending && (
            <Sparkles className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100" />
          )}
        </div>
      </Button>
      {ProUpgradeDialog}
    </>
  );
};

export default NewWorkflowButton;
