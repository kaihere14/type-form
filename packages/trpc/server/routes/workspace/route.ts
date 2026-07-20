import { z, zodUndefinedModel } from "../../schema";
import { workspaceService } from "../../services";
import { createWorkspaceInputSchema, updateWorkspaceInputSchema } from "@repo/services/workspace/model";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { WorkspaceSchema } from "./model";

const TAGS = ["Workspaces"];
const getPath = generatePath("/workspaces");

export const workspaceRouter = router({
  list: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/"), tags: TAGS, protect: true } })
    .input(zodUndefinedModel)
    .output(z.array(WorkspaceSchema))
    .query(async ({ ctx }) => {
      return workspaceService.listWorkspaces(ctx.user.id);
    }),

  getOrCreateDefault: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/default"), tags: TAGS, protect: true } })
    .input(zodUndefinedModel)
    .output(WorkspaceSchema)
    .query(async ({ ctx }) => {
      return workspaceService.getOrCreateDefaultWorkspace(ctx.user.id);
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS, protect: true } })
    .input(createWorkspaceInputSchema)
    .output(WorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      return workspaceService.createWorkspace(ctx.user.id, input);
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(updateWorkspaceInputSchema.extend({ id: z.string() }))
    .output(WorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return workspaceService.updateWorkspace(ctx.user.id, id, rest);
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await workspaceService.deleteWorkspace(ctx.user.id, input.id);
      return { success: true as const };
    }),
});
