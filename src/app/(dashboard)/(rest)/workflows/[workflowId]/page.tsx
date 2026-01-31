import DashboardLoading from "@/components/dashboard-loading";
import Editor from "@/feature/editor/component/editor";
import Workflow from "@/feature/workflows/components/Workflow";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";

interface WorkflowPageProps {
  params: Promise<{ workflowId: string }>;
}

const WorkflowPage = async ({ params }: WorkflowPageProps) => {
  await requireAuth();

  const { workflowId } = await params;

  void trpc.workflows.getMany.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DashboardLoading />}>
        <Editor workflowId={workflowId} />
      </Suspense>
    </HydrateClient>
  );
};

export default WorkflowPage;
