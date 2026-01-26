import WorkflowList from "@/feature/workflows/components/WorkflowList";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";

const Page = async () => {
  await requireAuth();

  // ✅ 在 Server Component 中预取数据
  void trpc.workflows.getMany.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading workflows...</div>}>
        <WorkflowList />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
