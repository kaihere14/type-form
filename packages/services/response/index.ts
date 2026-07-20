import { Form } from "@repo/database/models/form-model";
import { Response, IResponse } from "@repo/database/models/response-model";
import { Workspace } from "@repo/database/models/workspace-model";

import { submitResponseInputSchema, type SubmitResponseInputSchema } from "./model";

class ResponseService {
  private toPublicResponse(response: IResponse) {
    return {
      id: response.id as string,
      formId: response.formId.toString(),
      answers: response.answers.map((answer) => ({
        questionId: answer.questionId.toString(),
        value: answer.value,
      })),
      submittedAt: response.createdAt,
    };
  }

  private async assertWorkspaceOwnership(ownerId: string, workspaceId: string) {
    const workspace = await Workspace.findOne({ _id: workspaceId, ownerId });
    if (!workspace) throw new Error("Workspace not found");
  }

  public async submitResponse(input: SubmitResponseInputSchema) {
    const { shareCode, answers } = await submitResponseInputSchema.parseAsync(input);

    const form = await Form.findOne({ shareCode, status: "live" });
    if (!form) throw new Error("Form not found");

    const questionIds = new Set(form.questions.map((question) => question._id.toString()));
    for (const answer of answers) {
      if (!questionIds.has(answer.questionId)) throw new Error("Answer references an unknown question");
    }

    const requiredQuestionIds = form.questions
      .filter((question) => question.required)
      .map((question) => question._id.toString());
    const answeredQuestionIds = new Set(answers.map((answer) => answer.questionId));
    const missingRequired = requiredQuestionIds.some((id) => !answeredQuestionIds.has(id));
    if (missingRequired) throw new Error("All required questions must be answered");

    const response = await Response.create({ formId: form.id, answers });
    return { id: response.id as string };
  }

  public async listResponses(ownerId: string, formId: string) {
    const form = await Form.findById(formId);
    if (!form) throw new Error("Form not found");
    await this.assertWorkspaceOwnership(ownerId, form.workspaceId.toString());

    const responses = await Response.find({ formId }).sort({ createdAt: -1 });
    return responses.map((response) => this.toPublicResponse(response));
  }
}

export default ResponseService;
