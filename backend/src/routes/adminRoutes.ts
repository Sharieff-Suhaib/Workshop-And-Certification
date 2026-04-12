// backend/src/routes/adminRoutes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// All admin routes require authentication and admin role + email whitelist
router.get('/dashboard', adminMiddleware, AdminController.getDashboard);
router.get('/users', adminMiddleware, AdminController.getAllUsers);
router.post('/users/:userId/role', adminMiddleware, AdminController.updateUserRole);
router.delete('/users/:userId', adminMiddleware, AdminController.deleteUser);
router.get('/logs', adminMiddleware, AdminController.getLogs);

export default router;