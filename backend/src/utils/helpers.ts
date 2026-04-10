import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message: string = 'Success'
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  message?: string
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    message: message || error,
    error,
  };
  return res.status(statusCode).json(response);
};

export const handleZodError = (error: any) => {
  // Check if it's a ZodError
  if (error.issues && Array.isArray(error.issues)) {
    if (error.issues.length > 0) {
      const firstIssue = error.issues[0];
      const field = firstIssue.path?.join('.') || 'unknown';
      return `${field}: ${firstIssue.message}`;
    }
  }
  
  return 'Validation error';
};