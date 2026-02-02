import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import WorkflowNode from "./workflow-node";
import NodeSelector from "./react-flow/node-selector";

const InitialNode = memo((props: NodeProps) => {
  const [nodeSelectorOpen, setNodeSelectorOpen] = useState<boolean>(false);

  return (
    <NodeSelector open={nodeSelectorOpen} onOpenChange={setNodeSelectorOpen}>
      <WorkflowNode name="initial node" description="sample description">
        <PlaceholderNode
          {...props}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setNodeSelectorOpen(true);
          }}
        >
          <div className="cursor-pointer flex items-center justify-center ">
            <PlusIcon className="mx-auto h-6 w-6" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";

export default InitialNode;
