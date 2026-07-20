import { z } from "../../schema";
import { responseService } from "../../services";
import { submitResponseInputSchema } from "@repo/services/response/model";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { ResponseSchema } from "./model";

const TAGS = ["Responses"];
const getPath = generatePath("/responses");

export const responseRouter = router({
  submit: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS } })
    .input(submitResponseInputSchema)
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return responseService.submitResponse(input);
    }),

  listByForm: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/"), tags: TAGS, protect: true } })
    .input(z.object({ formId: z.string() }))
    .output(z.array(ResponseSchema))
    .query(async ({ ctx, input }) => {
      return responseService.listResponses(ctx.user.id, input.formId);
    }),
});
