import { trpc } from "@/trpc/client";

export const useSuspenseWorkflow = () => {
  const data = trpc.workflows.getMany.useSuspenseQuery();
  return data[0];
};
