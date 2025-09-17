import mongoose, { Document } from 'mongoose';
import { IResult } from '../types/resultTypes';


interface IResultDocument extends IResult, Document{};


const resultSchema = new mongoose.Schema<IResultDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId, // references the Question model
          ref: "Question",                      // so we can populate later if needed
          required: true,
        },
        selectedAnswer: {
          type: String,                         // what the user chose
          required: true,
        },
        correct: {
          type: Boolean,                        // true if user’s answer matched the correct one
          required: true,
        },
      },
    ],
  score: {
      type: Number,                             // total score for this attempt
      required: true,
    },
  createdAt: Date
}, {timestamps: true}  // auto adds createdAt & updatedAt fields
);

export default mongoose.model<IResultDocument>("Result", resultSchema);