import { Request, Response } from 'express';
import { IQuestion } from '../types/question';
import Question from '../models/Question';
import Result from '../models/Result';
import mongoose from 'mongoose';


export const addQuestion = async (req: Request, res: Response) => {
  try {
    const { question, options, correctAnswer, category} = req.body as IQuestion;

    // 1️⃣ Validate input
    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ message: "Question, options, and correctAnswer are required." });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Options must be an array with at least 2 items." });
    }

    if(!options.includes(correctAnswer)) {
      return res.status(400).json({ message: "Correct answer must be one of the options." })
    }

    // Create new question
    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
      category,
    });
    await newQuestion.save();

    return res.status(201).json(
      {message: "Question added successfully", question: newQuestion}
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
     const { category, limit, page } = req.query;

    // pagination setup
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    // build query
    const query: any = {};
    if (category) {
      query.category = category;
    }

    // fetch without correctAnswer field
    const questions = await Question.find(query)
      .select("-correctAnswer")
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      count: questions.length,
      page: pageNum,
      questions,
    });
  } catch (error: any) {
    res.status(5000).json({
      message: "Error Fetching Questions",
      error: error.message,
    });
  }
};

export const getQuestionsWithAnswers = async (req: Request, res: Response) => {
  try {
    const { category, limit, page } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (category) {
      query.category = category;
    }

    // Admins see correctAnswer
    const questions = await Question.find(query)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      count: questions.length,
      page: pageNum,
      questions,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error Fetching Questions (Admin)",
      error: error.message,
    });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;         // get question ID
    const { question, options, correctAnswer, category } = req.body; // destructure fields

    // 1️⃣ Check if question exists
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 1.5️⃣ Prevent updates if question is soft-deleted
    if (existingQuestion.isDeleted) {
      return res.status(400).json({ message: "Cannot update a soft-deleted question." });
    }

    // 2️⃣ Validate inputs (only if provided)
    if (question && question.trim().length === 0) {
      return res.status(400).json({ message: "Question cannot be empty." });
    }

    if (options && (!Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ message: "Options must be an array with at least 2 items." });
    }

    if (correctAnswer && options && !options.includes(correctAnswer)) {
      return res.status(400).json({ message: "Correct answer must be one of the options." });
    }

    // 3️⃣ Prepare update object dynamically (only update provided fields)
    const updateData: any = {};
    if (question) updateData.question = question;
    if (options) updateData.options = options;
    if (correctAnswer) updateData.correctAnswer = correctAnswer;
    if (category) updateData.category = category;

    // 4️⃣ Update in DB
    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating question",
      error: error.message,
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1) Validate id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question id." });
    }

    // 2) Find the question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const force = req.query.force === "true";

    // 3) If already soft-deleted
    if (question.isDeleted) {
      if (force) {
        // hard delete even if soft-deleted
        await Question.findByIdAndDelete(id);
        return res.status(200).json({
          message: "Question permanently deleted (was previously soft-deleted).",
          questionId: id,
        });
      }
      return res.status(400).json({ message: "Question already soft-deleted." });
    }

    // 4) Check if linked to player results
    const linkedResultCount = await Result.countDocuments({
      $or: [
        { "answers.question": id },
        { "answers.questionId": id },
        { questionId: id },
        { questionIds: id },
      ],
    });

    // 5) If linked, only soft-delete
    if (linkedResultCount > 0) {
      question.isDeleted = true;
      question.deletedAt = new Date();
      question.deletedBy = req.user?.userId || undefined;
      await question.save();

      return res.status(200).json({
        message:
          "Question soft-deleted. It is referenced in player results and therefore preserved for historical integrity.",
        questionId: id,
        linkedResultCount,
        note:
          "Because this question is referenced by players' results, it was soft-deleted to avoid breaking historical data. To permanently remove it, first clean up or archive related results, then call delete with ?force=true.",
      });
    }

    // 6) No linked results
    if (force) {
      await Question.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Question permanently deleted.",
        questionId: id,
      });
    }

    // 7) Default: soft-delete if no force
    question.isDeleted = true;
    question.deletedAt = new Date();
    question.deletedBy = req.user?.userId || undefined;
    await question.save();

    return res.status(200).json({
      message:
        "Question soft-deleted. No linked player results were found. If you want to permanently delete, call the same endpoint with ?force=true.",
      questionId: id,
    });
  } catch (error: any) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
