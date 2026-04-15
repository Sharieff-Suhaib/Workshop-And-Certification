import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/helpers';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      console.error('❌ No token provided');
      return sendError(res, 401, 'No token provided');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      console.error('❌ Invalid or expired token');
      return sendError(res, 401, 'Invalid or expired token');
    }

    // Attach userId to request object as custom property
    (req as any).userId = decoded.userId;

    console.log('✅ Auth middleware passed for user:', decoded.userId);
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    sendError(res, 401, error.message);
  }
};