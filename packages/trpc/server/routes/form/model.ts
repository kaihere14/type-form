import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["short_text", "long_text", "multiple_choice", "checkbox", "dropdown", "email", "number", "date", "rating"]),
  label: z.string(),
  description: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  order: z.number(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  workspaceId: z.string(),
  folderId: z.string().nullable(),
  status: z.enum(["draft", "live", "closed"]),
  shareCode: z.string(),
  questions: z.array(QuestionSchema),
  responseCount: z.number(),
  createdAt: z.date(),
  lastEditedAt: z.date(),
});
export type Form = z.infer<typeof FormSchema>;

// Respondent-facing view served from the shareable link — hides workspace/folder
// internals and the shareCode itself (it's already known to whoever has the link).
export const PublicFormSchema = FormSchema.pick({
  id: true,
  title: true,
  status: true,
  questions: true,
});
export type PublicForm = z.infer<typeof PublicFormSchema>;
