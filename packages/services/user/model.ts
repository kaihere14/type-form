import { z } from "zod";

export const createUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
export type CreateUserInputSchema = z.infer<typeof createUserInputSchema>;

export const loginUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginUserInputSchema = z.infer<typeof loginUserInputSchema>;

export const createResfreshTokenAndAccessToken = z.object({
  id: z.string(),
});
export const tokenOutputSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type TokenOutputSchema = z.infer<typeof tokenOutputSchema>;
export type CreateResfreshTokenAndAccessToken = z.infer<typeof createResfreshTokenAndAccessToken>;
