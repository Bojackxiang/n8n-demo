"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmState = ConfirmOptions & {
  isOpen: boolean;
};

const ConfirmAlertContext = React.createContext<{
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export const ConfirmAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: "Are you sure?",
    description: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  const [isPending, setIsPending] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options?: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        isOpen: true,
        title: options?.title || "Are you sure?",
        description: options?.description || "This action cannot be undone.",
        confirmText: options?.confirmText || "Confirm",
        cancelText: options?.cancelText || "Cancel",
      });
    });
  }, []);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      resolveRef.current?.(true);
      setState((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setIsPending(false);
      resolveRef.current = null;
    }
  };

  const handleCancel = () => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmAlertContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={state.isOpen} onOpenChange={handleCancel}>
        <AlertDialogContent className="border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/95">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold">
              {state.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {state.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              className="border-border/50 hover:bg-accent"
            >
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/50 transition-all hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {isPending ? "Loading..." : state.confirmText}
              </span>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmAlertContext.Provider>
  );
};

export const useConfirmAlert = () => {
  const context = React.useContext(ConfirmAlertContext);
  if (!context) {
    throw new Error("useConfirmAlert must be used within ConfirmAlertProvider");
  }
  return context.confirm;
};
