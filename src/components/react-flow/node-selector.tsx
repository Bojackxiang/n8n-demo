"use client";

import React, { useCallback } from "react";
import { createId } from "@paralleldrive/cuid2";
import { NodeType } from "@/types/node-types";
import { GlobeLockIcon, MousePointerIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

export type NodeTypeOption = {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Run the flow manually by clicking a button",
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make a http request to an external API",
    icon: GlobeLockIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const NodeSelector = (props: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          toast.error("Only one Manual Trigger node is allowed per workflow.");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialNode = getNodes().some(
          (node) => node.type === NodeType.INITIAL,
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          type: selection.type,
          position: {
            x: flowPosition.x,
            y: flowPosition.y,
          },
          data: {},
        };

        if (hasInitialNode) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      props.onOpenChange(false);
    },
    [getNodes, props, screenToFlowPosition, setNodes],
  );

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <div>
          <SheetHeader>
            <SheetTitle>Trigger Node</SheetTitle>
            <SheetDescription>
              Select a node type to add to your flow
            </SheetDescription>
          </SheetHeader>
          {triggerNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2bor border-transparent hover:bg-accent/50 hover:border-border flex items-center"
                onClick={() => {
                  handleNodeSelect(node);
                }}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof node.icon === "string" ? (
                    <img
                      src={node.icon}
                      alt={node.label}
                      className="size-5 flex-shrink-0"
                    />
                  ) : (
                    <Icon className="size-5 flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className=" text-xs text-muted-foreground">
                      {node.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <Separator />
          <SheetHeader>
            <SheetTitle>Execution node</SheetTitle>
            <SheetDescription>
              Select a node type to add to your flow
            </SheetDescription>
          </SheetHeader>
          {executionNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2bor border-transparent hover:bg-accent/50 hover:border-border flex items-center"
                onClick={() => {
                  handleNodeSelect(node);
                }}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof node.icon === "string" ? (
                    <img
                      src={node.icon}
                      alt={node.label}
                      className="size-5 flex-shrink-0"
                    />
                  ) : (
                    <Icon className="size-5 flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className=" text-xs text-muted-foreground">
                      {node.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeSelector;
