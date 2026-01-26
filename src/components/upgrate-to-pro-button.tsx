"use client";

import React from "react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useSubscription } from "@/feature/subscription/hook/use-subscription";
import { Crown, Sparkles, Loader2 } from "lucide-react";

const UpdateToProButton = () => {
  const { data, isLoading } = useSubscription();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const hasActiveSubscription =
    data?.activeSubscriptions && data.activeSubscriptions.length > 0;

  const onHandleClick = async () => {
    setIsCheckingOut(true);
    try {
      await authClient.checkout({
        slug: "Nodebase-Pro",
      });
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // 如果已经是 Pro 用户，显示不同的状态
  if (hasActiveSubscription) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="w-full justify-start gap-2 text-muted-foreground"
      >
        <Crown className="size-4 text-yellow-500" />
        <span className="flex-1 text-left text-primary">Pro Member</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={onHandleClick}
      disabled={isLoading || isCheckingOut}
      size="sm"
      className="group relative w-full overflow-hidden bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
    >
      {/* 背景动画效果 */}
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* 按钮内容 */}
      <div className="relative flex w-full items-center justify-start gap-2">
        {isCheckingOut ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            <span className="flex-1 text-left font-semibold">
              Upgrade to Pro
            </span>
          </>
        )}
      </div>
    </Button>
  );
};

export default UpdateToProButton;
