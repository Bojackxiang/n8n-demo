import { inngest } from "./client";

export const executeWorkflow = inngest.createFunction(
  { id: "workflow" },
  { event: "workflow/execute.workflow" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5s");
    // return { message: `Hello ${event.data.email}!` };
  },
);
