import type { ComponentProps } from "react";
import { XCircle, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { NodeStatus } from "../node-status-indicator";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: NodeStatus;
}

export function BaseNode({ className, status, ...props }: BaseNodeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "error":
        return "border-red-500/70 bg-red-50/50 dark:bg-red-950/20 [&_svg]:text-red-500";
      case "success":
        return "border-emerald-500/70 bg-emerald-50/50 dark:bg-emerald-950/20 [&_svg]:text-emerald-500";
      case "loading":
        return "[&_svg]:text-blue-500";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative rounded-md border",
        "hover:ring-1",
        // React Flow displays node elements inside of a `NodeWrapper` component,
        // which compiles down to a div with the class `react-flow__node`.
        // When a node is selected, the class `selected` is added to the
        // `react-flow__node` element. This allows us to style the node when it
        // is selected, using Tailwind's `&` selector.
        "[.react-flow\\_\\_node.selected_&]:border-muted-foreground",
        "[.react-flow\\_\\_node.selected_&]:shadow-lg",
        getStatusStyles(),
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {props.children}
      {status === "error" && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50">
          <XCircle className="h-4 w-4 !text-white" strokeWidth={2.5} />
        </div>
      )}
      {status === "success" && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50">
          <CheckCircle className="h-4 w-4 !text-white" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className,
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("user-select-none flex-1 font-semibold", className)}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 p-3", className)}
      {...props}
    />
  );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className,
      )}
      {...props}
    />
  );
}
