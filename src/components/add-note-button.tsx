import { memo, useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import NodeSelector from "./react-flow/node-selector";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button
        className="bg-background"
        variant="outline"
        size="icon"
        onClick={() => {}}
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
