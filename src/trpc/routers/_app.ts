import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createTRPCRouter } from "../init";
import { workflowsRouters } from "@/feature/workflows/server/router";

const modelName = process.env.AI_MODEL || "gemini-2.5-flash";
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

const google = createGoogleGenerativeAI({
  apiKey,
});

export const appRouter = createTRPCRouter({
  // WORKFLOWS ROUTER
  workflows: workflowsRouters,
});

// export type definition of API
export type AppRouter = typeof appRouter;
