import mongoose from "mongoose";
import { Folder, IFolder } from "@repo/database/models/folder-model";
import { Form } from "@repo/database/models/form-model";
import { Workspace } from "@repo/database/models/workspace-model";

import {
  createFolderInputSchema,
  type CreateFolderInputSchema,
  updateFolderInputSchema,
  type UpdateFolderInputSchema,
} from "./model";

interface FolderLike {
  _id: mongoose.Types.ObjectId;
  name: string;
  workspaceId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

class FolderService {
  private toPublicFolder(folder: FolderLike, formCount: number) {
    return {
      id: folder._id.toString(),
      name: folder.name,
      workspaceId: folder.workspaceId.toString(),
      formCount,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }

  private isDuplicateKeyError(err: unknown): boolean {
    return typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000;
  }

  private async assertWorkspaceOwnership(ownerId: string, workspaceId: string) {
    const workspace = await Workspace.findOne({ _id: workspaceId, ownerId });
    if (!workspace) throw new Error("Workspace not found");
  }

  private async findOwnedFolder(ownerId: string, id: string): Promise<IFolder> {
    const folder = await Folder.findById(id);
    if (!folder) throw new Error("Folder not found");
    await this.assertWorkspaceOwnership(ownerId, folder.workspaceId.toString());
    return folder;
  }

  public async listFolders(ownerId: string, workspaceId: string) {
    await this.assertWorkspaceOwnership(ownerId, workspaceId);

    const folders = await Folder.aggregate<FolderLike & { formCount: number }>([
      { $match: { workspaceId: new mongoose.Types.ObjectId(workspaceId) } },
      {
        $lookup: {
          from: Form.collection.name,
          localField: "_id",
          foreignField: "folderId",
          as: "forms",
        },
      },
      { $addFields: { formCount: { $size: "$forms" } } },
      { $project: { forms: 0 } },
      { $sort: { name: 1 } },
    ]);

    return folders.map((folder) => this.toPublicFolder(folder, folder.formCount));
  }

  public async createFolder(ownerId: string, input: CreateFolderInputSchema) {
    const { workspaceId, name } = await createFolderInputSchema.parseAsync(input);
    await this.assertWorkspaceOwnership(ownerId, workspaceId);

    try {
      const folder = await Folder.create({ workspaceId, name });
      return this.toPublicFolder(folder, 0);
    } catch (err) {
      if (this.isDuplicateKeyError(err)) throw new Error("A folder with this name already exists in this workspace");
      throw err;
    }
  }

  public async updateFolder(ownerId: string, id: string, input: UpdateFolderInputSchema) {
    const { name } = await updateFolderInputSchema.parseAsync(input);
    const folder = await this.findOwnedFolder(ownerId, id);
    folder.name = name;

    try {
      await folder.save();
    } catch (err) {
      if (this.isDuplicateKeyError(err)) throw new Error("A folder with this name already exists in this workspace");
      throw err;
    }
    const formCount = await Form.countDocuments({ folderId: folder.id });
    return this.toPublicFolder(folder, formCount);
  }

  public async deleteFolder(ownerId: string, id: string) {
    const folder = await this.findOwnedFolder(ownerId, id);
    await Form.updateMany({ folderId: folder.id }, { $unset: { folderId: 1 } });
    await folder.deleteOne();
  }
}

export default FolderService;
