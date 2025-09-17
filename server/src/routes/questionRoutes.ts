import { Router } from 'express';
import { 
   addQuestion,
   getQuestions, 
   getQuestionsWithAnswers, 
   updateQuestion, 
   deleteQuestion 
  } from '../controllers/questionController';
import { authenticate } from '../middleware/authmiddleware';
import { isAdmin } from '../middleware/adminmiddleware';


const router = Router();

// routes

// admin route
router.post('/admin/questions', authenticate, isAdmin, addQuestion);
router.get('/admin/questions', authenticate, isAdmin, getQuestionsWithAnswers);
router.put('/admin/questions/:id', authenticate, isAdmin, updateQuestion);
router.delete('/admin/questions/:id', authenticate, isAdmin, deleteQuestion);



// public route
router.get('/questions',authenticate, getQuestions);

export default router;