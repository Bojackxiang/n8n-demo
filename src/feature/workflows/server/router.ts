import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { pagination } from "@/config/workflowlist";
import { NodeType } from "@/generated/prisma/enums";
import { Node, Edge } from "@xyflow/react";
import { inngest } from "@/ingest/client";

export const workflowsRouters = createTRPCRouter({
  // inngest procedure
  execute: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirstOrThrow({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });

      await inngest.send({
        name: "workflow/execute.workflow",
      });

      return workflow;
    }),

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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullable(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullable(),
            targetHandle: z.string().nullable(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });

      return await prisma.$transaction(async (prisma) => {
        // Delete existing nodes and connections
        await prisma.node.deleteMany({
          where: {
            workflowId: workflow.id,
          },
        });

        await prisma.connection.deleteMany({
          where: {
            workflowId: workflow.id,
          },
        });

        await prisma.node.createMany({
          data: input.nodes.map((node) => ({
            id: node.id,
            workflowId: workflow.id,
            type: (node.type || NodeType.INITIAL) as NodeType,
            name: node.type || NodeType.INITIAL,
            position: node.position,
            data: node.data || {},
          })),
        });

        await prisma.connection.createMany({
          data: input.edges.map((edge) => ({
            id: `${edge.source}-${edge.sourceHandle || "default"}-to-${
              edge.target
            }-${edge.targetHandle || "default"}`,
            workflowId: workflow.id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        await prisma.workflow.update({
          where: {
            id: workflow.id,
          },
          data: {
            updatedAt: new Date(),
          },
        });

        return workflow;
      });
    }),
});
