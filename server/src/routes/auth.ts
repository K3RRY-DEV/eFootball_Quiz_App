import { Router } from 'express';
import { signup, login , verifyAuth} from '../controllers/authController';


const router = Router();

// routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', verifyAuth);

export default router;