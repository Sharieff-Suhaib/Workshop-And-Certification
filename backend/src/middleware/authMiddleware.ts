import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/helpers';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return sendError(res, 401, 'No token provided');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired token');
    }

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    sendError(res, 401, error.message);
  }
};