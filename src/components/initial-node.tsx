import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import WorkflowNode from "./workflow-node";

const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode name="initial node" description="sample description">
      <PlaceholderNode {...props} onClick={() => {}}>
        <div className="cursor-pointer flex items-center justify-center ">
          <PlusIcon className="mx-auto h-6 w-6" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

InitialNode.displayName = "InitialNode";

export default InitialNode;
