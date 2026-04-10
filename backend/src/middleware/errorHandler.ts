import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/helpers';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err);

  if (err.name === 'ZodError') {
    return sendError(res, 400, 'Validation error', 'Invalid input');
  }

  return sendError(res, err.statusCode || 500, err.message || 'Internal Server Error');
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};