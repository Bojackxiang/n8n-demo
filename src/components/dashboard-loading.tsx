"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/page-container";

const DashboardLoading = () => {
  return (
    <PageContainer header={<LoadingHeader />} footer={<LoadingFooter />}>
      <div className="px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 模拟工作流卡片 */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border border-border/40 bg-card p-5 shadow-sm transition-all"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            >
              {/* 卡片头部 */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  {/* 标题骨架 - 带渐变 */}
                  <Skeleton className="h-5 w-3/4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
                  {/* 描述骨架 */}
                  <Skeleton className="h-4 w-full bg-muted/50" />
                  <Skeleton className="h-4 w-5/6 bg-muted/30" />
                </div>
                {/* 操作按钮骨架 */}
                <Skeleton className="h-8 w-8 rounded-md bg-muted/40" />
              </div>

              {/* 卡片底部 */}
              <div className="flex items-center justify-between pt-3">
                <Skeleton className="h-4 w-20 rounded-full bg-muted/40" />
                <Skeleton className="h-5 w-16 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />
              </div>

              {/* 底部渐变条 - 模拟 hover 效果 */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 opacity-0 animate-pulse" />

              {/* 闪烁动画效果 */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* 添加 shimmer 动画 */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </PageContainer>
  );
};

export default DashboardLoading;

const LoadingHeader = () => {
  return (
    <div className="border-b border-border/40 bg-background/95 px-6 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {/* 标题骨架 - 带渐变高光 */}
          <Skeleton className="h-9 w-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />
          {/* 副标题骨架 */}
          <Skeleton className="h-4 w-48 bg-muted/40" />
        </div>
        {/* 按钮骨架 - 模拟主题按钮 */}
        <Skeleton className="h-10 w-40 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 shadow-lg shadow-blue-500/10" />
      </div>
    </div>
  );
};

const LoadingFooter = () => {
  return (
    <div className="border-t border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        {/* 左侧信息骨架 */}
        <Skeleton className="h-5 w-48 bg-muted/40" />
        {/* 右侧分页骨架 */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-24 rounded-md bg-muted/40" />
          <Skeleton className="h-9 w-9 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />
          <Skeleton className="h-9 w-9 rounded-md bg-muted/30" />
          <Skeleton className="h-9 w-9 rounded-md bg-muted/30" />
          <Skeleton className="h-9 w-24 rounded-md bg-muted/40" />
        </div>
      </div>
    </div>
  );
};
