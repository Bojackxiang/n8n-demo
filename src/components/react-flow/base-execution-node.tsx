"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "./base-node";
import WorkflowNode from "../workflow-node";
import { BaseHandle } from "../base-handle";
import { NodeStatus, NodeStatusIndicator } from "../node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon;
  name: string;
  label: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseExecutionNode = memo(
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
  }: BaseExecutionNodeProps) => {
    const onHandleDelete = () => {};

    const handleDoubleClick = useCallback(() => {
      if (onDoubleClick) {
        onDoubleClick();
      }
    }, [onDoubleClick]);

    return (
      <NodeStatusIndicator status={status} variant="border">
        <WorkflowNode
          name={name}
          description={description}
          onDelete={onHandleDelete}
          onSettings={onSettings}
        >
          <BaseNode onDoubleClick={handleDoubleClick} status={status}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={`${name}-icon`} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id={"target-1"}
                position={Position.Left}
                type="target"
              />
              <BaseHandle
                id={"source-1"}
                position={Position.Right}
                type="source"
              />
            </BaseNodeContent>
          </BaseNode>
        </WorkflowNode>
      </NodeStatusIndicator>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";

export default BaseExecutionNode;
