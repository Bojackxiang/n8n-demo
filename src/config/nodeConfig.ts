import InitialNode from "@/components/initial-node";
import { NodeType } from "@/types/node-types";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: InitialNode,
} as const satisfies NodeTypes;
