import { memo } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { DbNull } from "../generated/prisma/internal/prismaNamespace";

export const AddNodeButton = memo(() => {
  return (
    <Button
      className="bg-background"
      variant="outline"
      size="icon"
      onClick={() => {}}
    >
      <PlusIcon />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
