import { Request, Response } from 'express';
import Result from '../models/Result';



export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // Fetch top 10 results across all users
    const leaderboard = await Result.find()
      .populate({
        path: "user",
        select: "username", // show only username, not sensitive info
      })
      .sort({ score: -1, createdAt: 1 }) // highest score first; tie-breaker by earliest attempt
      .limit(10);

    res.status(200).json({
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
