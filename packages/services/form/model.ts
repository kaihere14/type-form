import { z } from "zod";

export const questionInputSchema = z.object({
  type: z.enum(["short_text", "long_text", "multiple_choice", "checkbox", "dropdown", "email", "number", "date", "rating"]),
  label: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string().min(1)).optional(),
  order: z.number().int().min(0),
});
export type QuestionInputSchema = z.infer<typeof questionInputSchema>;

export const createFormInputSchema = z.object({
  workspaceId: z.string(),
  folderId: z.string().optional(),
  title: z.string().min(1).max(120),
});
export type CreateFormInputSchema = z.infer<typeof createFormInputSchema>;

export const updateFormInputSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  status: z.enum(["draft", "live", "closed"]).optional(),
  folderId: z.string().nullable().optional(),
  questions: z.array(questionInputSchema).optional(),
});
export type UpdateFormInputSchema = z.infer<typeof updateFormInputSchema>;

export const listFormsInputSchema = z.object({
  workspaceId: z.string(),
  folderId: z.string().optional(),
  status: z.enum(["draft", "live", "closed"]).optional(),
});
export type ListFormsInputSchema = z.infer<typeof listFormsInputSchema>;
