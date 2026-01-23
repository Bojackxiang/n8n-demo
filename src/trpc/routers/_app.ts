import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";

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
});
// export type definition of API
export type AppRouter = typeof appRouter;
