"use client";

import React from "react";
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
  const workflows = useSuspenseWorkflow();

  return (
    <PageContainer
      header={<WorkflowsHeader totalCount={workflows.length} />}
      footer={<WorkflowFooter />}
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

const WorkflowFooter = () => {
  return (
    <div className="border-t border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        {/* Left side - showing results info */}
        <p className="text-sm text-muted-foreground">
          Showing 1-10 of 42 results
        </p>

        {/* Right side - pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive={false}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive={false}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
