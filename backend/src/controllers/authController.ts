import { Response } from 'express';
import type { Request } from 'express';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError } from '../utils/helpers';
import { prisma } from '../index';
import { generateToken } from '../utils/jwt';
import { loginSchema } from '../validation/login';
import { registerSchema } from '../validation/register';
export class AuthController {
  // ============ REGISTER ============
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validated = registerSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (existingUser) {
        sendError(res, 400, 'Email already registered');
        return;
      }

      const hashedPassword = await bcrypt.hash(validated.password, 10);

      const user = await prisma.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          password: hashedPassword,
          role: 'USER',
        },
      });

      const token = generateToken(user.id);

      sendSuccess(res, 201, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      if (error.errors) {
        sendError(res, 400, error.errors[0].message);
      } else {
        sendError(res, 500, error.message);
      }
    }
  };

  // ============ LOGIN ============
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validated = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (!user) {
        sendError(res, 401, 'Invalid email or password');
        return;
      }

      const passwordMatch = await bcrypt.compare(
        validated.password,
        user.password
      );

      if (!passwordMatch) {
        sendError(res, 401, 'Invalid email or password');
        return;
      }

      const token = generateToken(user.id);

      sendSuccess(res, 200, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      if (error.errors) {
        sendError(res, 400, error.errors[0].message);
      } else {
        sendError(res, 500, error.message);
      }
    }
  };

  // ============ GET CURRENT USER ============
  static getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImage: true,
        },
      });

      if (!user) {
        sendError(res, 404, 'User not found');
        return;
      }

      sendSuccess(res, 200, {
        authenticated: true,
        user,
      });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  };

  // ============ LOGOUT ============
  static logout = (req: Request, res: Response): void => {
    try {
      req.logout((logoutErr: Error | null) => {
        if (logoutErr) {
          console.error('Logout error:', logoutErr);
          sendError(res, 500, 'Logout failed');
          return;
        }

        if (req.session) {
          req.session.destroy((destroyErr: Error | null) => {
            if (destroyErr) {
              console.error('Session destroy error:', destroyErr);
              sendError(res, 500, 'Session destruction failed');
              return;
            }

            res.clearCookie('connect.sid');
            sendSuccess(res, 200, null, 'Logged out successfully');
          });
        } else {
          res.clearCookie('connect.sid');
          sendSuccess(res, 200, null, 'Logged out successfully');
        }
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      sendError(res, 500, error.message);
    }
  };
}