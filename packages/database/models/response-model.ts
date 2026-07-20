import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;
  value: unknown;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

export interface IResponse extends Document {
  id?: string;
  formId: Types.ObjectId;
  answers: Types.DocumentArray<IAnswer>;
  createdAt: Date;
  updatedAt: Date;
}

const responseSchema = new Schema<IResponse>(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    answers: { type: [answerSchema], default: [] },
  },
  { timestamps: true }
);

// formId prefix supports both "does this form have responses" and
// "list this form's responses, newest first" queries.
responseSchema.index({ formId: 1, createdAt: -1 });

export const Response: Model<IResponse> =
  mongoose.models.Response || mongoose.model<IResponse>("Response", responseSchema);
