import { z } from "zod";

export const submitResponseInputSchema = z.object({
  shareCode: z.string(),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        value: z.unknown(),
      }),
    )
    .min(1),
});
export type SubmitResponseInputSchema = z.infer<typeof submitResponseInputSchema>;
