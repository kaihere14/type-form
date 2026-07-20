import { z } from "zod";

export const createFolderInputSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(1).max(60),
});
export type CreateFolderInputSchema = z.infer<typeof createFolderInputSchema>;

export const updateFolderInputSchema = z.object({
  name: z.string().min(1).max(60),
});
export type UpdateFolderInputSchema = z.infer<typeof updateFolderInputSchema>;
