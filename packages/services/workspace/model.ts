import { z } from "zod";

export const createWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(80),
});
export type CreateWorkspaceInputSchema = z.infer<typeof createWorkspaceInputSchema>;

export const updateWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(80),
});
export type UpdateWorkspaceInputSchema = z.infer<typeof updateWorkspaceInputSchema>;
