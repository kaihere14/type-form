import { z } from "../../schema";
import { folderService } from "../../services";
import { createFolderInputSchema, updateFolderInputSchema } from "@repo/services/folder/model";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { FolderSchema } from "./model";

const TAGS = ["Folders"];
const getPath = generatePath("/folders");

export const folderRouter = router({
  list: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/"), tags: TAGS, protect: true } })
    .input(z.object({ workspaceId: z.string() }))
    .output(z.array(FolderSchema))
    .query(async ({ ctx, input }) => {
      return folderService.listFolders(ctx.user.id, input.workspaceId);
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS, protect: true } })
    .input(createFolderInputSchema)
    .output(FolderSchema)
    .mutation(async ({ ctx, input }) => {
      return folderService.createFolder(ctx.user.id, input);
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(updateFolderInputSchema.extend({ id: z.string() }))
    .output(FolderSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return folderService.updateFolder(ctx.user.id, id, rest);
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await folderService.deleteFolder(ctx.user.id, input.id);
      return { success: true as const };
    }),
});
