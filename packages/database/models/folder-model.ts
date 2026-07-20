import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFolder extends Document {
  id?: string;
  name: string;
  workspaceId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true, trim: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  },
  { timestamps: true }
);

// Unique per workspace (same name OK in two different workspaces) + doubles as the
// "list this workspace's folders" lookup index since workspaceId is the prefix.
folderSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export const Folder: Model<IFolder> =
  mongoose.models.Folder || mongoose.model<IFolder>("Folder", folderSchema);
