import { Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendError, handleZodError } from '../utils/helpers';
import { registerSchema } from '../validation/register'
import { loginSchema } from '../validation/login';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  static register = asyncHandler(async (req: any, res: Response) => {
    try {
      const validated = registerSchema.parse(req.body);

      const result = await AuthService.register(validated);

      sendSuccess(res, 201, result, 'Registration successful');
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errorMessage = handleZodError(error);
        return sendError(res, 400, errorMessage, 'Validation error');
      }
      sendError(res, 400, error.message);
    }
  });

  static login = asyncHandler(async (req: any, res: Response) => {
    try {
      const validated = loginSchema.parse(req.body);

      const result = await AuthService.login(validated);

      sendSuccess(res, 200, result, 'Login successful');
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errorMessage = handleZodError(error);
        return sendError(res, 400, errorMessage, 'Validation error');
      }
      sendError(res, 401, error.message);
    }
  });

  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const user = await AuthService.getCurrentUser(userId);

      sendSuccess(res, 200, user);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  });

  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      const result = await AuthService.logout();

      sendSuccess(res, 200, result, 'Logout successful');
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  });
}