import { Document, Types } from 'mongoose';

export interface IResult extends Document {
  user: Types.ObjectId;  // reference to User model
  questions: {
    question: Types.ObjectId;   // reference to Question model
    selectedAnswer: string;     // answer chosen by the user
    correct: boolean;           // was it correct?
  }[];
  score: number;                // total score
  createdAt: Date;
  updatedAt: Date;
}
