// backend/src/controllers/adminController.ts
import { Response } from 'express';
import type { Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { prisma } from '../index';

export class AdminController {
  // ============ GET DASHBOARD ============
  static getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const totalUsers = await prisma.user.count();
      const adminUsers = await prisma.user.count({
        where: { role: 'SUPER_ADMIN' },
      });

      sendSuccess(res, 200, {
        totalUsers,
        adminUsers,
        message: 'Dashboard data retrieved successfully',
      });
    } catch (error: any) {
      console.error('❌ Get dashboard error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET ALL USERS ============
  static getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          profileImage: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      sendSuccess(res, 200, {
        users,
        total: users.length,
      });
    } catch (error: any) {
      console.error('❌ Get all users error:', error);
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

      if (!userId) {
        sendError(res, 400, 'User ID is required');
        return;
      }

      if (!['USER', 'MODERATOR', 'SUPER_ADMIN'].includes(role)) {
        sendError(res, 400, 'Invalid role');
        return;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      console.log(`✅ User role updated:`, user.email, 'to', role);

      sendSuccess(res, 200, { user, message: 'User role updated successfully' });
    } catch (error: any) {
      console.error('❌ Update user role error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ DELETE USER ============
  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Array.isArray(req.params.userId) 
        ? req.params.userId[0] 
        : req.params.userId;

      if (!userId) {
        sendError(res, 400, 'User ID is required');
        return;
      }

      const user = await prisma.user.delete({
        where: { id: userId },
        select: { email: true, name: true },
      });

      console.log(`✅ User deleted:`, user.email);

      sendSuccess(res, 200, { message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('❌ Delete user error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET LOGS ============
  static getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      sendSuccess(res, 200, {
        message: 'Logs retrieved successfully',
        logs: [],
      });
    } catch (error: any) {
      console.error('❌ Get logs error:', error);
      sendError(res, 500, error.message);
    }
  };
}