import { Request, Response } from 'express';
import Result from '../models/Result';
import Question from '../models/Question';

export const getMyResults = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Get the logged-in user ID from authenticate middleware
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Fetch all results for this user
    const results = await Result.find({ user: userId })
      .populate({
        path: "questions.question",
        select: "question options", // include only question text & options
      })
      .sort({ createdAt: -1 }); // latest results first

    res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Error fetching user results:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
