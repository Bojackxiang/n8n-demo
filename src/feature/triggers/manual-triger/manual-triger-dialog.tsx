"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MousePointerIcon } from "lucide-react";

interface ManualTriggerDialogProps {
  open: boolean;
  onClose: () => void;
}

const ManualTriggerDialog = memo(
  ({ open, onClose }: ManualTriggerDialogProps) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <MousePointerIcon className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-semibold">
                Manual Trigger
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-sm text-muted-foreground">
              This workflow is triggered manually when you click the "Execute
              Flow" button.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
              <p className="text-sm text-foreground">
                Manual triggers allow you to start your workflow on demand. This
                is useful for testing or when you need full control over when
                the workflow executes.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ManualTriggerDialog.displayName = "ManualTriggerDialog";

export default ManualTriggerDialog;
