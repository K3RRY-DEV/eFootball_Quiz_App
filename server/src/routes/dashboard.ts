import { Router } from 'express';
import { authenticate } from '../middleware/authmiddleware';
import { isAdmin } from '../middleware/adminmiddleware';

const router = Router();

// User dashboard route
router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: `Welcome user ${req.user?.username}` });
});

// Admin-only route
router.get('/admin/dashboard', authenticate, isAdmin, (req, res) => {
  res.json({ message: `Welcome admin ${req.user?.username}` });
});

export default router;