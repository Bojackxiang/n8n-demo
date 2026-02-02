import { memo } from "react";
import { GlobeIcon } from "lucide-react";
import type { Node, NodeProps, useReactFlow } from "@xyflow/react";
import BaseExecutionNode from "@/components/react-flow/base-execution-node";

type HttpRequestNodeData = {
  endpoint?: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "NOT CONFIGURED";

  return (
    <BaseExecutionNode
      {...props}
      id={props.id}
      icon={GlobeIcon}
      name="HTTP REQUEST"
      label="HTTP Request"
      description={description}
      onSettings={() => {}}
      onDoubleClick={() => {}}
    />
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
