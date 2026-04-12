// backend/src/middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/helpers';
import { prisma } from '../index';
import { isAdminEmail } from '../config/adminWhitelist';

export interface AdminRequest extends Request {
  userId?: string;
  user?: any;
}

export const adminMiddleware = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      console.error('❌ No token provided for admin route');
      return sendError(res, 401, 'No token provided');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      console.error('❌ Invalid or expired token for admin route');
      return sendError(res, 401, 'Invalid or expired token');
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.error('❌ User not found:', decoded.userId);
      return sendError(res, 404, 'User not found');
    }

    // Check if user has SUPER_ADMIN role
    if (user.role !== 'SUPER_ADMIN') {
      console.error('❌ User does not have SUPER_ADMIN role:', user.email);
      return sendError(res, 403, 'Insufficient permissions');
    }

    // Check if email is whitelisted
    if (!isAdminEmail(user.email)) {
      console.error('❌ Admin email not whitelisted:', user.email);
      return sendError(res, 403, 'Email not authorized for admin access');
    }

    console.log('✅ Admin access granted for:', user.email);

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error: any) {
    console.error('Admin middleware error:', error);
    sendError(res, 401, error.message);
  }
};