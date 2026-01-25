import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";
import { inngest } from "@/ingest/client";
import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import * as Sentry from "@sentry/nextjs";

const modelName = process.env.AI_MODEL || "gemini-2.5-flash";
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

const google = createGoogleGenerativeAI({
  apiKey,
});

export const appRouter = createTRPCRouter({
  // ai
  testAi: baseProcedure.mutation(async () => {
    try {
      const { text } = await generateText({
        model: google(modelName),
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
        // experimental_telemetry: {
        //   isEnabled: true,
        //   recordInputs: true,
        //   recordOutputs: true,
        // },
      });
      Sentry.logger.info("AI test successful");
      return { text };
    } catch (error) {
      console.log("error: ", error);
      return {
        text: null,
      };
    }
  }),

  // users
  getUsers: protectedProcedure.query((opt) => {
    const context = opt.ctx;

    return prisma.user.findMany({
      where: {
        id: context.auth.user.id,
      },
    });
  }),
  getWorkflows: protectedProcedure.query(async () => {
    try {
      const workflows = await prisma.workflow.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log("Fetched workflows:", workflows);
      return workflows;
    } catch (error) {
      console.error("Error fetching workflows:", error);
      throw error;
    }
  }),
  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: "alex@gmail.com",
        },
      });
      return await prisma.workflow.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
        },
      });
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
