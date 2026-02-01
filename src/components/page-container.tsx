"use client";

import React, { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * PageContainer - 统一的页面布局容器
 *
 * 提供一致的页面结构：header + content + footer
 * 适用于所有需要标准布局的页面（desktop & mobile）
 *
 * @example
 * ```tsx
 * <PageContainer
 *   header={<PageHeader title="Title" />}
 *   footer={<PageFooter />}
 * >
 *   <YourContent />
 * </PageContainer>
 * ```
 */
const PageContainer = ({
  children,
  header,
  footer,
  className = "",
}: PageContainerProps) => {
  return (
    <div className="flex h-screen flex-col">
      {/* Header Section */}
      {header && <div className="flex-shrink-0">{header}</div>}

      {/* Content Section */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Footer Section */}
      {footer && <div className="flex-shrink-0">{footer}</div>}
    </div>
  );
};

export default PageContainer;
