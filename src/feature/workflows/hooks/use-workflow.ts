import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { pagination } from "@/config/workflowlist";

export const useSuspenseWorkflow = (
  page: number = pagination.default_page,
  pageSize: number = pagination.default_page_size,
) => {
  const data = trpc.workflows.getMany.useSuspenseQuery({
    page,
    pageSize,
  });
  return data[0];
};

export const useCreateNewWorkflow = () => {
  const utils = trpc.useUtils();

  return trpc.workflows.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" created successfully!`);
      // 使查询缓存失效，自动重新获取列表
      utils.workflows.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create workflow");
    },
  });
};
