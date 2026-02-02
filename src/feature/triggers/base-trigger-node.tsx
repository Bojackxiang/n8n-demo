"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import WorkflowNode from "@/components/workflow-node";
import { BaseHandle } from "@/components/base-handle";
import BaseExecutionNode from "@/components/react-flow/base-execution-node";

interface BaseTriggerNode extends NodeProps {
  icon: LucideIcon;
  name: string;
  label: string;
  description?: string;
  children?: ReactNode;

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
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNode) => {
    const onHandleDelete = () => {};

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
        <BaseNode
          onDoubleClick={handleDoubleClick}
          className="rounded-2xl relative group"
        >
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
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";

export default BaseTriggerNode;
