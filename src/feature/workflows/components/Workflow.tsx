"use client";

import React from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { useSuspenseWorkflow } from "../hooks/use-workflow";
import WorkflowList from "./WorkflowList";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import NewWorkflowButton from "./NewWorkflowButton";
import PageContainer from "@/components/page-container";

const Workflow = () => {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );
  const { workflows, pagination } = useSuspenseWorkflow(currentPage);

  return (
    <PageContainer
      header={<WorkflowsHeader totalCount={pagination.total} />}
      footer={
        <WorkflowFooter pagination={pagination} onPageChange={setCurrentPage} />
      }
    >
      <div className="px-6 py-8">
        <WorkflowList workflows={workflows} />
      </div>
    </PageContainer>
  );
};

export default Workflow;

const WorkflowsHeader = ({ totalCount }: { totalCount: number }) => {
  return (
    <div className="border-b border-border/40 bg-background/95 px-6 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "workflow" : "workflows"} total
          </p>
        </div>
        <NewWorkflowButton />
      </div>
    </div>
  );
};

const WorkflowFooter = ({
  pagination,
  onPageChange,
}: {
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
}) => {
  const {
    total,
    totalPages,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  // 计算显示范围
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总是显示第一页
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // 显示当前页附近的页码
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // 总是显示最后一页
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className="border-t border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        {/* Left side - showing results info */}
        <p className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {total} results
        </p>

        {/* Right side - pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
                className={
                  !hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => hasNextPage && onPageChange(currentPage + 1)}
                className={
                  !hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
