// backend/src/routes/adminRoutes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// All admin routes require authentication and admin role + email whitelist
router.get('/dashboard', adminMiddleware, AdminController.getDashboard);
router.get('/workshops', adminMiddleware, AdminController.getWorkshops);
router.post('/workshops', adminMiddleware, AdminController.createWorkshop);
router.put('/workshops/:workshopId', adminMiddleware, AdminController.updateWorkshop);
router.delete('/workshops/:workshopId', adminMiddleware, AdminController.deleteWorkshop);
router.get('/users', adminMiddleware, AdminController.getAllUsers);
router.post('/users/:userId/role', adminMiddleware, AdminController.updateUserRole);
router.delete('/users/:userId', adminMiddleware, AdminController.deleteUser);
router.get('/logs', adminMiddleware, AdminController.getLogs);

export default router;