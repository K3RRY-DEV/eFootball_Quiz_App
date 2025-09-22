import { Router } from 'express';
import { authenticate } from '../middleware/authmiddleware';
import { submitQuiz } from '../controllers/submitQuizController';



const router = Router();

router.post('/submit', authenticate, submitQuiz);


export default router;