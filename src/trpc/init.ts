import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  const headersList = await headers();

  return {
    headers: headersList,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
// base protected procedure that verifies authentication
export const protectedProcedure = baseProcedure.use(async (opts) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      auth: session,
    },
  });
});
