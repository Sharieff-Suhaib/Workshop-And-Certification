import { Router } from 'express';
import { RegistrationController } from '../controllers/registrationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, RegistrationController.createRegistration);
router.get('/my', authMiddleware, RegistrationController.getMyRegistrations);
router.get('/all', authMiddleware, RegistrationController.getAllRegistrations);


export default router;