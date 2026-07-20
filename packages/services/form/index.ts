import mongoose from "mongoose";
import { Form, IForm, IQuestion } from "@repo/database/models/form-model";
import { Folder } from "@repo/database/models/folder-model";
import { Workspace } from "@repo/database/models/workspace-model";
import { Response } from "@repo/database/models/response-model";

import {
  createFormInputSchema,
  type CreateFormInputSchema,
  updateFormInputSchema,
  type UpdateFormInputSchema,
  listFormsInputSchema,
  type ListFormsInputSchema,
} from "./model";

interface FormLike {
  _id: mongoose.Types.ObjectId;
  title: string;
  workspaceId: mongoose.Types.ObjectId;
  folderId?: mongoose.Types.ObjectId;
  status: IForm["status"];
  shareCode: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

class FormService {
  private toPublicQuestion(question: IQuestion) {
    return {
      id: question._id.toString(),
      type: question.type,
      label: question.label,
      description: question.description,
      required: question.required,
      options: question.options,
      order: question.order,
    };
  }

  private toPublicForm(form: FormLike, responseCount: number) {
    return {
      id: form._id.toString(),
      title: form.title,
      workspaceId: form.workspaceId.toString(),
      folderId: form.folderId ? form.folderId.toString() : null,
      status: form.status,
      shareCode: form.shareCode,
      questions: form.questions.map((question) => this.toPublicQuestion(question)),
      responseCount,
      createdAt: form.createdAt,
      lastEditedAt: form.updatedAt,
    };
  }

  private async assertWorkspaceOwnership(ownerId: string, workspaceId: string) {
    const workspace = await Workspace.findOne({ _id: workspaceId, ownerId });
    if (!workspace) throw new Error("Workspace not found");
  }

  private async assertFolderInWorkspace(folderId: string, workspaceId: string) {
    const folder = await Folder.findOne({ _id: folderId, workspaceId });
    if (!folder) throw new Error("Folder not found");
  }

  private async findOwnedForm(ownerId: string, id: string): Promise<IForm> {
    const form = await Form.findById(id);
    if (!form) throw new Error("Form not found");
    await this.assertWorkspaceOwnership(ownerId, form.workspaceId.toString());
    return form;
  }

  public async listForms(ownerId: string, input: ListFormsInputSchema) {
    const { workspaceId, folderId, status } = await listFormsInputSchema.parseAsync(input);
    await this.assertWorkspaceOwnership(ownerId, workspaceId);

    const match: Record<string, unknown> = { workspaceId: new mongoose.Types.ObjectId(workspaceId) };
    if (folderId) match.folderId = new mongoose.Types.ObjectId(folderId);
    if (status) match.status = status;

    const forms = await Form.aggregate<FormLike & { responseCount: number }>([
      { $match: match },
      {
        $lookup: {
          from: Response.collection.name,
          localField: "_id",
          foreignField: "formId",
          as: "responses",
        },
      },
      { $addFields: { responseCount: { $size: "$responses" } } },
      { $project: { responses: 0 } },
      { $sort: { updatedAt: -1 } },
    ]);

    return forms.map((form) => this.toPublicForm(form, form.responseCount));
  }

  public async getForm(ownerId: string, id: string) {
    const form = await this.findOwnedForm(ownerId, id);
    const responseCount = await Response.countDocuments({ formId: form.id });
    return this.toPublicForm(form, responseCount);
  }

  public async getFormByShareCode(shareCode: string) {
    const form = await Form.findOne({ shareCode, status: "live" });
    if (!form) throw new Error("Form not found");
    return this.toPublicForm(form, 0);
  }

  public async createForm(ownerId: string, input: CreateFormInputSchema) {
    const { workspaceId, folderId, title } = await createFormInputSchema.parseAsync(input);
    await this.assertWorkspaceOwnership(ownerId, workspaceId);
    if (folderId) await this.assertFolderInWorkspace(folderId, workspaceId);

    const form = await Form.create({ workspaceId, folderId, title });
    return this.toPublicForm(form, 0);
  }

  public async updateForm(ownerId: string, id: string, input: UpdateFormInputSchema) {
    const { title, status, folderId, questions } = await updateFormInputSchema.parseAsync(input);
    const existing = await this.findOwnedForm(ownerId, id);

    const setUpdate: Record<string, unknown> = {};
    const unsetUpdate: Record<string, 1> = {};

    if (title !== undefined) setUpdate.title = title;
    if (status !== undefined) setUpdate.status = status;
    if (questions !== undefined) setUpdate.questions = questions;

    if (folderId !== undefined) {
      if (folderId === null) {
        unsetUpdate.folderId = 1;
      } else {
        await this.assertFolderInWorkspace(folderId, existing.workspaceId.toString());
        setUpdate.folderId = folderId;
      }
    }

    const update: mongoose.UpdateQuery<IForm> = {};
    if (Object.keys(setUpdate).length > 0) update.$set = setUpdate;
    if (Object.keys(unsetUpdate).length > 0) update.$unset = unsetUpdate;

    const form = await Form.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
      context: "query",
    });
    if (!form) throw new Error("Form not found");

    const responseCount = await Response.countDocuments({ formId: form.id });
    return this.toPublicForm(form, responseCount);
  }

  public async deleteForm(ownerId: string, id: string) {
    const form = await this.findOwnedForm(ownerId, id);
    await Response.deleteMany({ formId: form.id });
    await form.deleteOne();
  }
}

export default FormService;
