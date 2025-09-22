import { Router } from 'express';
import { authenticate } from '../middleware/authmiddleware';
import { getLeaderboard } from '../controllers/leaderboardController';


const router = Router();

// Leaderboard accessible to logged-in users
router.get('/leaderboard', authenticate, getLeaderboard);

export default router;
