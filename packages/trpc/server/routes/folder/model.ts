import { z } from "zod";

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  formCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Folder = z.infer<typeof FolderSchema>;
