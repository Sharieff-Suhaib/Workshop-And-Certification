import { Response, Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { RegistrationService } from '../services/registrationService';

export class RegistrationController {
  // ============ CREATE REGISTRATION + GENERATE CERTIFICATE ============
  static createRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { workshopId } = req.body;

      console.log('🎮 Controller: Creating registration');
      console.log('🎮 Controller: userId:', userId, 'workshopId:', workshopId);

      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      // Call service to create registration
      const registration = await RegistrationService.createRegistration(userId, workshopId);

      sendSuccess(res, 201, { registration }, 'Registered successfully');
    } catch (error: any) {
      console.error('❌ Controller: Registration error:', error);
      sendError(res, error.message.includes('already') ? 400 : 500, error.message);
    }
  };

  // ============ GET MY REGISTRATIONS ============
  static getMyRegistrations = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      console.log('🎮 Controller: Getting my registrations');
      console.log('🎮 Controller: userId:', userId);

      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      // Call service to get registrations
      const data = await RegistrationService.getMyRegistrations(userId);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get registrations error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET ALL REGISTRATIONS (ADMIN) ============
  static getAllRegistrations = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🎮 Controller: Getting all registrations (Admin)');

      // Call service to get all registrations
      const data = await RegistrationService.getAllRegistrations();

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get all registrations error:', error);
      sendError(res, 500, error.message);
    }
  };
}