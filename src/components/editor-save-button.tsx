"use client";

import { useUpdateWorkflow } from "@/feature/workflows/hooks/use-workflow";
import React from "react";
import { Node, Edge, useReactFlow } from "@xyflow/react";
import { Button } from "./ui/button";
import { Save, Loader2 } from "lucide-react";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/feature/editor/store/atoms";

interface EditorSaveButtonProps {
  workflowId: string;
}

const EditorSaveButton = ({ workflowId }: EditorSaveButtonProps) => {
  const updateWorkflow = useUpdateWorkflow();

  const editor = useAtomValue(editorAtom);

  const handleSave = () => {
    if (!editor) {
      return;
    }

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    updateWorkflow.mutate({
      id: workflowId,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type ?? null,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle ?? null,
        targetHandle: edge.targetHandle ?? null,
      })),
    });
  };

  return (
    <Button
      onClick={handleSave}
      className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {updateWorkflow.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span className="font-medium">
          {updateWorkflow.isPending ? "Saving..." : "Save Workflow"}
        </span>
      </div>
    </Button>
  );
};

export default EditorSaveButton;
