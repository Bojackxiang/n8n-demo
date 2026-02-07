import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import BaseExecutionNode from "@/components/react-flow/base-execution-node";
import HttpRequestTriggerDialog from "./http-request-triger-dialog";
import { HttpRequestFormValues } from "./http-request.type";

type HttpRequestNodeType = Node<HttpRequestFormValues>;

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
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
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
        defaultValues={nodeData}
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
