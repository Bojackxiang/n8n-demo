"use client";

import { useState } from "react";
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
import { Sparkles, Crown, Check } from "lucide-react";
import {
  useIsProActive,
  useSubscription,
} from "@/feature/subscription/hook/use-subscription";

interface ProUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export function ProRequiredAlert({
  open,
  onOpenChange,
  featureName = "this feature",
}: ProUpgradeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md overflow-hidden border-border/40 p-0">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-8 text-white">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

          {/* Icon */}
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-sm">
            <Crown className="h-8 w-8 text-white" />
          </div>

          <AlertDialogHeader className="relative space-y-2 text-center">
            <AlertDialogTitle className="text-2xl font-semibold text-white">
              Upgrade to Pro
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-white/90">
              Unlock {featureName} and all premium features
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Features list */}
        <div className="space-y-3 px-6 py-6">
          <p className="text-sm font-medium text-foreground">
            Pro features include:
          </p>

          <ul className="space-y-2">
            {[
              "Unlimited workflows",
              "Advanced automation",
              "Priority support",
              "Custom integrations",
              "Team collaboration",
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pricing hint */}
          <div className="mt-4 rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Starting at $9/month</span>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <AlertDialogFooter className="border-t border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <AlertDialogCancel className="border-border/50 text-muted-foreground hover:bg-accent hover:text-foreground">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center gap-2">
              <Crown className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="font-medium">Upgrade Now</span>
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Custom hook to control ProUpgradeDialog
 * @param defaultFeatureName - Default feature name to display
 * @param onProUserAction - Callback function to execute if user is Pro
 * @returns Object with checkProAlert function and ProUpgradeDialog component
 */
export function useProUpgradeDialog(
  defaultFeatureName?: string,
  onProUserAction?: () => void,
) {
  const [open, setOpen] = useState(false);
  const [featureName, setFeatureName] = useState(defaultFeatureName);
  const isPro = useIsProActive();

  /**
   * Check if user is Pro and execute action or show dialog
   * @param feature - Optional feature name to override default
   */
  const checkProAlert = (feature?: string) => {
    if (isPro) {
      // If user is Pro, execute the callback
      onProUserAction?.();
    } else {
      // If user is not Pro, show the upgrade dialog
      if (feature) {
        setFeatureName(feature);
      }
      setOpen(true);
    }
  };

  /**
   * Hide the Pro upgrade dialog
   */
  const hideDialog = () => {
    setOpen(false);
  };

  return {
    checkProAlert,
    hideDialog,
    open,
    setOpen,
    isPro,
    ProUpgradeDialog: (
      <ProRequiredAlert
        open={open}
        onOpenChange={setOpen}
        featureName={featureName}
      />
    ),
  };
}
