import { Response } from 'express';
import type { Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { prisma } from '../index';

export class OAuthController {
  // ============ GOOGLE CALLBACK ============
  static googleCallback = (req: Request, res: Response): void => {
    try {
      const user = req.user;

      if (!user || !user.token) {
        res.redirect(
          `http://localhost:3000/auth/login?error=Authentication failed`
        );
        return;
      }

      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectURL = `${frontendURL}/auth/callback?token=${encodeURIComponent(
        user.token
      )}&user=${encodeURIComponent(
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        })
      )}`;

      res.redirect(redirectURL);
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      res.redirect(
        `http://localhost:3000/auth/login?error=Authentication error`
      );
    }
  };

  // ============ GOOGLE AUTH FAILURE ============
  static googleAuthFailure = (req: Request, res: Response): void => {
    console.error('❌ Google authentication failed');
    res.redirect(
      `http://localhost:3000/auth/login?error=Google authentication failed`
    );
  };

  // ============ GET CURRENT USER ✅ ============
  static getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('📍 /oauth/me endpoint called');
      console.log('🔐 Auth header:', req.headers.authorization?.substring(0, 30) + '...');
      
      // Get user from JWT token (authMiddleware sets it)
      const userId = (req as any).user?.userId;

      if (!userId) {
        console.error('❌ No userId in request');
        sendError(res, 401, 'Unauthorized');
        return;
      }

      console.log('🔍 Looking up user:', userId);

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
        console.error('❌ User not found:', userId);
        sendError(res, 404, 'User not found');
        return;
      }

      console.log('✅ User found:', user.email);

      sendSuccess(res, 200, {
        authenticated: true,
        user,
      });
    } catch (error: any) {
      console.error('❌ Get current user error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ LOGOUT ============
  static logout = (req: Request, res: Response): void => {
    try {
      const userId = req.user?.id;
      const sessionID = req.sessionID;

      console.log(`🚪 Logging out user: ${userId}`);
      console.log(`📦 Session ID: ${sessionID}`);

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

            console.log(`✅ User ${userId} logged out successfully`);

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