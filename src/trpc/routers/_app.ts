import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";
import { inngest } from "@/ingest/client";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
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
