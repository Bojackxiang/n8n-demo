import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import ManualTriggerDialog from "./manual-triger-dialog";
import { NodeStatus } from "@/components/node-status-indicator";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  let nodeStatus: NodeStatus = "initial";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <BaseTriggerNode
        {...props}
        status={nodeStatus}
        icon={MousePointerIcon}
        label="MANUAL_TRIGGER"
        name="When click 'Execute Flow' button"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
