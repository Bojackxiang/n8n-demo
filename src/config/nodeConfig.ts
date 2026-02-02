import InitialNode from "@/components/initial-node";
import { HttpRequestNode } from "@/feature/executions/http-request/node";
import { ManualTriggerNode } from "@/feature/triggers/manual-triger/node";
import { NodeType } from "@/types/node-types";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;
