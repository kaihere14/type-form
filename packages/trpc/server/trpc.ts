import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { userService } from "./services";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

const verifyJwt = tRPCContext.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : undefined;

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing access token" });
  }

  try {
    const user = userService.verifyAccessToken(token);
    return next({ ctx: { user } });
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired access token" });
  }
});

export const protectedProcedure = tRPCContext.procedure.use(verifyJwt);
