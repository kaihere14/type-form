import mongoose, { Schema, Document, Model, Types } from "mongoose";
import crypto from "crypto";

export type FormStatus = "draft" | "live" | "closed";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "email"
  | "number"
  | "date"
  | "rating";

const CHOICE_QUESTION_TYPES: QuestionType[] = ["multiple_choice", "checkbox", "dropdown"];

export interface IQuestion {
  _id: Types.ObjectId;
  type: QuestionType;
  label: string;
  description?: string;
  required: boolean;
  options?: string[];
  order: number;
}

const questionSchema = new Schema<IQuestion>({
  type: {
    type: String,
    enum: ["short_text", "long_text", "multiple_choice", "checkbox", "dropdown", "email", "number", "date", "rating"],
    required: true,
  },
  label: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  required: { type: Boolean, default: false },
  options: {
    type: [String],
    validate: {
      validator: function (this: IQuestion, value: string[] | undefined) {
        if (!CHOICE_QUESTION_TYPES.includes(this.type)) return true;
        return Array.isArray(value) && value.length > 0;
      },
      message: "options must be a non-empty array for multiple_choice, checkbox, or dropdown questions",
    },
  },
  order: { type: Number, required: true },
});

export interface IForm extends Document {
  id?: string;
  title: string;
  workspaceId: Types.ObjectId;
  folderId?: Types.ObjectId;
  status: FormStatus;
  shareCode: string;
  questions: Types.DocumentArray<IQuestion>;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = new Schema<IForm>(
  {
    title: { type: String, required: true, trim: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    folderId: { type: Schema.Types.ObjectId, ref: "Folder" },
    status: { type: String, enum: ["draft", "live", "closed"], required: true, default: "draft" },
    shareCode: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(8).toString("hex"),
    },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

formSchema.index({ workspaceId: 1 });
formSchema.index({ folderId: 1 }, { sparse: true });

export const Form: Model<IForm> =
  mongoose.models.Form || mongoose.model<IForm>("Form", formSchema);
