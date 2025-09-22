import { Router } from 'express';
import { authenticate } from '../middleware/authmiddleware';
import { getMyResults } from '../controllers/resultController';


const router = Router();

// Logged-in users can fetch their own results
router.get('/results', authenticate, getMyResults);


export default router;
