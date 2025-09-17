import mongoose, { Document } from 'mongoose';
import { IQuestion } from '../types/question';


interface IQuestionDocument extends IQuestion, Document{
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string | null;
};

const questionSchema = new mongoose.Schema<IQuestionDocument>({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Soft delete fields
  // mark as deleted without removing from DB
  isDeleted: {
    type: Boolean,
    default: false
  },
  // timestamp when soft-deleted
  deletedAt: {
    type: Date,
    default: null
  },
  // admin who deleted
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: "User", default: null
  },
});

export default mongoose.model<IQuestionDocument>('Question', questionSchema);