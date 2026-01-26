import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const workflowsRouters = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const workflow = await prisma.workflow.create({
      data: {
        name: "TODO",
        userId: ctx.auth.user.id,
      },
    });
    return workflow;
  }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.delete({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });
      return workflow;
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.update({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return workflow;
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });
      return workflow;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const workflows = await prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
    return workflows;
  }),
});
