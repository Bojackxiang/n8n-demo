import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { pagination } from "@/config/workflowlist";
import { NodeType } from "@/generated/prisma/enums";
import { Node, Edge } from "@xyflow/react";

export const workflowsRouters = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const workflow = await prisma.workflow.create({
      data: {
        name: "TODO",
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            name: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            // data: { label: "+" },
          },
        },
        connections: {},
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
      const workflow = await prisma.workflow.findFirstOrThrow({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      const nodes: Node[] = (workflow?.nodes || []).map((node) => {
        return {
          ...node,
          id: node.id,
          position: node.position as { x: number; y: number },
          data: (node.data as Record<string, unknown>) || {},
          type: node.type,
        };
      });

      const connections: Edge[] = (workflow?.connections || []).map(
        (connection) => {
          return {
            ...connection,
            id: connection.id,
            source: connection.fromNodeId,
            target: connection.toNodeId,
            sourceHandle: connection.fromOutput,
            targetHandle: connection.toInput,
          };
        },
      );

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        connections,
      };
    }),

  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().int().positive().optional(),
          pageSize: z.number().int().positive().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? pagination.default_page;
      const pageSize = input?.pageSize ?? pagination.default_page_size;
      const skip = (page - 1) * pageSize;

      // 获取总数
      const total = await prisma.workflow.count({
        where: {
          userId: ctx.auth.user.id,
        },
      });

      // 获取分页数据
      const workflows = await prisma.workflow.findMany({
        where: {
          userId: ctx.auth.user.id,
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalPages = Math.ceil(total / pageSize);

      return {
        workflows,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          pageSize,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }),
});
