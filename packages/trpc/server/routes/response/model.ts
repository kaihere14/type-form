import { z } from "zod";

export const AnswerSchema = z.object({
  questionId: z.string(),
  value: z.unknown(),
});
export type Answer = z.infer<typeof AnswerSchema>;

export const ResponseSchema = z.object({
  id: z.string(),
  formId: z.string(),
  answers: z.array(AnswerSchema),
  submittedAt: z.date(),
});
export type Response = z.infer<typeof ResponseSchema>;
