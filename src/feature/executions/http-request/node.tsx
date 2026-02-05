import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import BaseExecutionNode from "@/components/react-flow/base-execution-node";
import HttpRequestTriggerDialog from "./http-request-triger-dialog";

type HttpRequestNodeData = {
  endpoint?: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

type HttpRequestFormValues = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { setNodes } = useReactFlow();

  const nodeData = props.data;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "NOT CONFIGURED";

  const nodeStatus = "initial";

  const onOpenDialog = () => {
    setDialogOpen(true);
  };

  const onSubmit = (values: HttpRequestFormValues) => {
    console.log("HTTP Request submitted:", values);
    // update single node metadata
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                endpoint: values.endpoint,
                method: values.method,
                body: values.body,
              },
            }
          : node,
      ),
    );
    setDialogOpen(false);
  };

  return (
    <>
      <HttpRequestTriggerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={onSubmit}
        defaultBody={nodeData.body || ""}
        defaultEndpoint={nodeData.endpoint || ""}
        defaultMethod={nodeData.method || "GET"}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        status={nodeStatus}
        name="HTTP REQUEST"
        label="HTTP Request"
        description={description}
        onSettings={onOpenDialog}
        onDoubleClick={onOpenDialog}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
