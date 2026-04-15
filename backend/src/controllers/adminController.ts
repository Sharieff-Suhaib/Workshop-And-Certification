import { Response, Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { AdminService } from '../services/adminService';

export class AdminController {
  // ============ GET DASHBOARD ============
  static getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🎮 Controller: Getting dashboard');

      const data = await AdminService.getDashboardData();

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get dashboard error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET ALL USERS ============
  static getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🎮 Controller: Getting all users');

      const data = await AdminService.getAllUsers();

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get all users error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ UPDATE USER ROLE ============
  static updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;
      const { role } = req.body;

      console.log('🎮 Controller: Updating user role for userId:', userId);

      const data = await AdminService.updateUserRole(userId, role);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Update user role error:', error);
      sendError(res, 400, error.message);
    }
  };

  // ============ DELETE USER ============
  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;

      console.log('🎮 Controller: Deleting user:', userId);

      const data = await AdminService.deleteUser(userId);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Delete user error:', error);
      sendError(res, 400, error.message);
    }
  };

  // ============ GET LOGS ============
  static getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🎮 Controller: Getting logs');

      const data = await AdminService.getLogs();

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get logs error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET ALL WORKSHOPS ============
  static getWorkshops = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🎮 Controller: Getting all workshops');

      const data = await AdminService.getWorkshops();

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Get workshops error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ CREATE WORKSHOP ============
  static createWorkshop = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, category, date, time, location, capacity } = req.body;

      console.log('🎮 Controller: Creating workshop:', title);

      const workshop = await AdminService.createWorkshop(
        title,
        description,
        category,
        date,
        time,
        location,
        capacity
      );

      sendSuccess(res, 201, { workshop }, 'Workshop created successfully');
    } catch (error: any) {
      console.error('❌ Controller: Create workshop error:', error);
      sendError(res, 400, error.message);
    }
  };

  // ============ UPDATE WORKSHOP ============
  static updateWorkshop = async (req: Request, res: Response): Promise<void> => {
    try {
      const workshopId = Array.isArray(req.params.workshopId)
        ? req.params.workshopId[0]
        : req.params.workshopId;
      const { title, description, category, date, time, location, capacity } = req.body;

      console.log('🎮 Controller: Updating workshop:', workshopId);

      const workshop = await AdminService.updateWorkshop(
        workshopId,
        title,
        description,
        category,
        date,
        time,
        location,
        capacity
      );

      sendSuccess(res, 200, { workshop }, 'Workshop updated successfully');
    } catch (error: any) {
      console.error('❌ Controller: Update workshop error:', error);
      sendError(res, 400, error.message);
    }
  };

  // ============ DELETE WORKSHOP ============
  static deleteWorkshop = async (req: Request, res: Response): Promise<void> => {
    try {
      const workshopId = Array.isArray(req.params.workshopId)
        ? req.params.workshopId[0]
        : req.params.workshopId;

      console.log('🎮 Controller: Deleting workshop:', workshopId);

      const data = await AdminService.deleteWorkshop(workshopId);

      sendSuccess(res, 200, data);
    } catch (error: any) {
      console.error('❌ Controller: Delete workshop error:', error);
      sendError(res, 400, error.message);
    }
  };
}