import { Workspace, IWorkspace } from "@repo/database/models/workspace-model";
import { Folder } from "@repo/database/models/folder-model";
import { Form } from "@repo/database/models/form-model";
import { Response } from "@repo/database/models/response-model";

import {
  createWorkspaceInputSchema,
  type CreateWorkspaceInputSchema,
  updateWorkspaceInputSchema,
  type UpdateWorkspaceInputSchema,
} from "./model";

const DEFAULT_WORKSPACE_NAME = "My Workspace";

class WorkspaceService {
  private toPublicWorkspace(workspace: IWorkspace) {
    return {
      id: workspace.id as string,
      name: workspace.name,
      ownerId: workspace.ownerId.toString(),
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  private async findOwnedWorkspace(ownerId: string, id: string): Promise<IWorkspace> {
    const workspace = await Workspace.findOne({ _id: id, ownerId });
    if (!workspace) throw new Error("Workspace not found");
    return workspace;
  }

  public async listWorkspaces(ownerId: string) {
    const workspaces = await Workspace.find({ ownerId }).sort({ createdAt: 1 });
    return workspaces.map((workspace) => this.toPublicWorkspace(workspace));
  }

  public async getOrCreateDefaultWorkspace(ownerId: string) {
    const workspace = await Workspace.findOneAndUpdate(
      { ownerId },
      { $setOnInsert: { ownerId, name: DEFAULT_WORKSPACE_NAME } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    if (!workspace) throw new Error("Failed to resolve default workspace");
    return this.toPublicWorkspace(workspace);
  }

  public async createWorkspace(ownerId: string, input: CreateWorkspaceInputSchema) {
    const { name } = await createWorkspaceInputSchema.parseAsync(input);
    const workspace = await Workspace.create({ ownerId, name });
    return this.toPublicWorkspace(workspace);
  }

  public async updateWorkspace(ownerId: string, id: string, input: UpdateWorkspaceInputSchema) {
    const { name } = await updateWorkspaceInputSchema.parseAsync(input);
    const workspace = await this.findOwnedWorkspace(ownerId, id);
    workspace.name = name;
    await workspace.save();
    return this.toPublicWorkspace(workspace);
  }

  public async deleteWorkspace(ownerId: string, id: string) {
    const workspace = await this.findOwnedWorkspace(ownerId, id);
    const forms = await Form.find({ workspaceId: workspace.id }).select("_id");
    const formIds = forms.map((form) => form.id);

    await Promise.all([
      Response.deleteMany({ formId: { $in: formIds } }),
      Form.deleteMany({ workspaceId: workspace.id }),
      Folder.deleteMany({ workspaceId: workspace.id }),
    ]);
    await workspace.deleteOne();
  }
}

export default WorkspaceService;
