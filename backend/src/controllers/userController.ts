import { Response, Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { UserService } from '../services/userService';

export class UserController {
  // ============ GET USER DASHBOARD DATA ============
  static getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      console.log('🎮 Controller: Dashboard request - userId:', userId);

      if (!userId) {
        console.error('❌ Controller: No userId in request');
        sendError(res, 401, 'Unauthorized - No user ID');
        return;
      }

      // Call service to get data
      const data = await UserService.getDashboardData(userId);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get dashboard error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET ALL AVAILABLE WORKSHOPS ============
  static getAllWorkshops = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      console.log('🎮 Controller: Getting all workshops - userId:', userId);

      if (!userId) {
        console.error('❌ Controller: No userId in request');
        sendError(res, 401, 'Unauthorized - No user ID');
        return;
      }

      // Call service to get data
      const data = await UserService.getAllWorkshops(userId);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get workshops error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET USER CERTIFICATES ============
  static getUserCertificates = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      console.log('🎮 Controller: Getting certificates - userId:', userId);

      if (!userId) {
        console.error('❌ Controller: No userId in request');
        sendError(res, 401, 'Unauthorized - No user ID');
        return;
      }

      // Call service to get data
      const data = await UserService.getUserCertificates(userId);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get certificates error:', error);
      sendError(res, 500, error.message);
    }
  };
}