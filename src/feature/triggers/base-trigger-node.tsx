"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import WorkflowNode from "@/components/workflow-node";
import { BaseHandle } from "@/components/base-handle";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/node-status-indicator";

interface BaseTriggerNode extends NodeProps {
  icon: LucideIcon;
  name: string;
  label: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseTriggerNode = memo(
  ({
    id,
    data,
    name,
    selected,
    icon: Icon,
    label,
    status = "initial",
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNode) => {
    const { setNodes, setEdges } = useReactFlow();

    const onHandleDelete = () => {
      setNodes((nds) => {
        return nds.filter((node) => node.id !== id);
      });

      setEdges((eds) => {
        return eds.filter((edge) => edge.source !== id && edge.target !== id);
      });
    };

    const handleDoubleClick = useCallback(() => {
      if (onDoubleClick) {
        onDoubleClick();
      }
    }, [onDoubleClick]);

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={onHandleDelete}
        onSettings={onSettings}
      >
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode status={status} onDoubleClick={handleDoubleClick}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={`${name}-icon`} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id={"source-1"}
                position={Position.Right}
                type="source"
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";

export default BaseTriggerNode;
