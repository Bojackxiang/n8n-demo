import DashboardLoading from "@/components/dashboard-loading";
import Workflow from "@/feature/workflows/components/Workflow";

import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";

const Page = async () => {
  await requireAuth();

  // ✅ 在 Server Component 中预取数据
  void trpc.workflows.getMany.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DashboardLoading />}>
        <Workflow />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
