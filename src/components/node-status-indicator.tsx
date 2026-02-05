import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      {children}

      <div className="bg-background/70 absolute inset-0 z-[100] rounded-md backdrop-blur-sm" />
      <div className="absolute inset-0 z-[100] flex items-center justify-center">
        <span className="absolute inline-block h-12 w-12 animate-ping rounded-full bg-blue-500/40" />
        <LoaderCircle
          className="size-8 animate-spin text-blue-500"
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className="absolute -top-px -left-px h-[calc(100%+2px)] w-[calc(100%+2px)]">
        <style>
          {`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 140%;
          aspect-ratio: 1;
          transform-origin: center;
        }
      `}
        </style>
        <div
          className={cn(
            className,
            "absolute inset-0 overflow-hidden rounded-md",
          )}
        >
          <div
            className="spinner bg-[conic-gradient(from_0deg_at_50%_50%,rgb(59,130,246)_0deg,rgba(59,130,246,0)_360deg)]"
            style={{ borderRadius: "0.375rem" }}
          />
        </div>
      </div>
      {children}
    </>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "absolute -top-px -left-px h-[calc(100%+2px)] w-[calc(100%+2px)] rounded-md border-2",
          className,
        )}
      />
      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
        case "border":
          return <BorderLoadingIndicator>{children}</BorderLoadingIndicator>;
        default:
          return <>{children}</>;
      }
    case "success":
      return (
        <StatusBorder className="border-emerald-600">{children}</StatusBorder>
      );
    case "error":
      return <StatusBorder className="border-red-400">{children}</StatusBorder>;
    default:
      return <>{children}</>;
  }
};
