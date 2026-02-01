"use client";

import PageContainer from "@/components/page-container";
import NewWorkflowButton from "@/feature/workflows/components/NewWorkflowButton";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useConfirmAlert } from "@/components/confirm-alert";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "../../../config/nodeConfig";
import { AddNodeButton } from "@/components/add-note-button";

const Editor = (params: { workflowId: string }) => {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const [workflow] = trpc.workflows.getOne.useSuspenseQuery({
    id: params.workflowId,
  });

  const { id, name, nodes: nodeData, connections: connectionData } = workflow;

  const [nodes, setNodes] = useState<Node[]>(nodeData);
  const [edges, setEdges] = useState<Edge[]>(connectionData as Edge[]);

  if (!workflow) {
    return (
      <PageContainer
        header={<EditorHeader workflow={null} />}
        footer={<Footer />}
      >
        <div className="px-6 py-8">Workflow not found</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={<EditorHeader workflow={workflow} />}
      footer={
        <Footer
          onSave={() => {
            console.log("Save workflow clicked");
          }}
        />
      }
    >
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeComponents}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap />
          <Panel position="top-right">
            <AddNodeButton />
          </Panel>
        </ReactFlow>
      </div>
    </PageContainer>
  );
};

export default Editor;

const EditorHeader = ({
  workflow,
}: {
  workflow: { id: string; name: string } | null;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(workflow?.name || "");
  const utils = trpc.useUtils();
  const confirm = useConfirmAlert();

  const updateWorkflow = trpc.workflows.updateName.useMutation({
    onSuccess: (data) => {
      toast.success(`Workflow renamed to "${data.name}"`);
      setIsEditing(false);
      if (workflow) {
        utils.workflows.getOne.invalidate({ id: workflow.id });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workflow name");
    },
  });

  const handleSave = async () => {
    if (!workflow) return;

    if (!editedName.trim()) {
      toast.error("Workflow name cannot be empty");
      return;
    }
    if (editedName === workflow.name) {
      setIsEditing(false);
      return;
    }

    const isConfirmed = await confirm({
      title: "Rename Workflow",
      description: `Are you sure you want to rename "${workflow.name}" to "${editedName.trim()}"?`,
      confirmText: "Rename",
      cancelText: "Cancel",
    });

    if (isConfirmed) {
      updateWorkflow.mutate({
        id: workflow.id,
        name: editedName.trim(),
      });
    }
  };

  const handleCancel = () => {
    setEditedName(workflow?.name || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!workflow) {
    return (
      <div className="border-b border-border/40 bg-background/95 px-6 py-6 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Workflow Editor
          </h1>
          <NewWorkflowButton />
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border/40 bg-background/95 px-6 py-6 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {isEditing ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="max-w-md border-0 border-b-2 border-blue-300 bg-transparent text-2xl font-semibold shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-cyan-500 focus-visible:ring-0"
                placeholder="Workflow name"
                autoFocus
                disabled={updateWorkflow.isPending}
              />
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={updateWorkflow.isPending}
                  className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={updateWorkflow.isPending}
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="group flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {workflow.name}
              </h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit name</span>
              </Button>
            </div>
          )}
        </div>
        <NewWorkflowButton />
      </div>
    </div>
  );
};

export const Footer = ({ onSave }: { onSave?: () => void }) => {
  return (
    <div className="border-t border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-end">
        <Button
          onClick={onSave}
          className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 px-6 text-white shadow-lg shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative z-10 font-medium">Save Workflow</span>
        </Button>
      </div>
    </div>
  );
};
