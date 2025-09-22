import { Request, Response } from 'express';
import Result from '../models/Result';
import Question from '../models/Question';


// Controller to handle quiz submission
export const submitQuiz = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get user ID from authenticated request
    const userId = req.user?.userId; // req.user is set by your authenticate middleware
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // 2️⃣ Get submitted answers from request body
    // Expected format: [{ questionId: "id", selectedAnswer: "option" }, ...]
    const { questions } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "No questions submitted." });
    }

    // 3️⃣ Fetch the questions from DB to check correct answers
    const questionIds = questions.map((q: any) => q.questionId); // extract IDs
    const dbQuestions = await Question.find({ _id: { $in: questionIds } }).lean();

    if (dbQuestions.length !== questions.length) {
      return res.status(400).json({ message: "Some submitted questions are invalid." });
    }

    // 4️⃣ Calculate correctness for each question
    const resultQuestions = questions.map((q: any) => {
      const dbQuestion = dbQuestions.find((d) => d._id.toString() === q.questionId);
      const isCorrect = dbQuestion?.correctAnswer === q.selectedAnswer;
      return {
        question: q.questionId,
        selectedAnswer: q.selectedAnswer,
        correct: isCorrect,
      };
    });

    // 5️⃣ Calculate total score (number of correct answers)
    const score = resultQuestions.filter((q) => q.correct).length;

    // 6️⃣ Create a new Result document and save
    const newResult = new Result({
      user: userId,
      questions: resultQuestions,
      score,
      createdAt: new Date(),
    });
    await newResult.save();

    // 7️⃣ Return success response
    return res.status(201).json({
      message: "Quiz submitted successfully.",
      score,
      results: resultQuestions, // optional detailed per-question feedback
    });

  } catch (error: any) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


