import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { createUserInputSchema, loginUserInputSchema } from "@repo/services/user/model";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { googleCallbackInputSchema, LoginWithProviderSchema, PublicUserSchema } from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUser: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create-user"), tags: TAGS } })
    .input(createUserInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await userService.createUser(input);
      return { id: user };
    }),

  loginUser: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login-user"), tags: TAGS } })
    .input(loginUserInputSchema)
    .output(z.object({ user: PublicUserSchema, accessToken: z.string(), refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const { user, accessToken, refreshToken } = await userService.loginUser(input);
      return { user, accessToken, refreshToken };
    }),

  loginWithProvider: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login-with-provider"), tags: TAGS } })
    .input(LoginWithProviderSchema)
    .output(z.object({ redirect: z.string() }))
    .mutation(async ({ input }) => {
      const result = await userService.loginWithProvider(input);
      return result;
    }),

  googleCallback: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/google/callback"), tags: TAGS } })
    .input(googleCallbackInputSchema)
    .output(z.object({ redirect: z.string() }))
    .query(async ({ input }) => {
      const { code } = await googleCallbackInputSchema.parseAsync(input);
      const { redirect } = await userService.googleLoginCallback(code);
      return { redirect };
    }),

  me: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: TAGS, protect: true } })
    .input(zodUndefinedModel)
    .output(z.object({ user: PublicUserSchema }))
    .query(async ({ ctx }) => {
      const user = await userService.getUserById(ctx.user.id);
      return { user };
    }),
});
