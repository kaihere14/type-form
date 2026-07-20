import { z } from "../../schema";
import { formService } from "../../services";
import { createFormInputSchema, updateFormInputSchema, listFormsInputSchema } from "@repo/services/form/model";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { FormSchema, PublicFormSchema } from "./model";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
  list: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/"), tags: TAGS, protect: true } })
    .input(listFormsInputSchema)
    .output(z.array(FormSchema))
    .query(async ({ ctx, input }) => {
      return formService.listForms(ctx.user.id, input);
    }),

  getById: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(z.object({ id: z.string() }))
    .output(FormSchema)
    .query(async ({ ctx, input }) => {
      return formService.getForm(ctx.user.id, input.id);
    }),

  getByShareCode: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/shared/{shareCode}"), tags: TAGS } })
    .input(z.object({ shareCode: z.string() }))
    .output(PublicFormSchema)
    .query(async ({ input }) => {
      return formService.getFormByShareCode(input.shareCode);
    }),

  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS, protect: true } })
    .input(createFormInputSchema)
    .output(FormSchema)
    .mutation(async ({ ctx, input }) => {
      return formService.createForm(ctx.user.id, input);
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(updateFormInputSchema.extend({ id: z.string() }))
    .output(FormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return formService.updateForm(ctx.user.id, id, rest);
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{id}"), tags: TAGS, protect: true } })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      await formService.deleteForm(ctx.user.id, input.id);
      return { success: true as const };
    }),
});
