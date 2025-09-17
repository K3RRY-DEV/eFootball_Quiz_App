

export interface IQuestion {
  question : string;
  options : string[];
  correctAnswer : string;
  category?: string;
  createdAt?: Date
};