import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All user routes require authentication
router.get('/dashboard', authMiddleware, UserController.getDashboard);
router.get('/workshops', UserController.getAllWorkshops);
router.get('/certificates', authMiddleware, UserController.getUserCertificates);

export default router;