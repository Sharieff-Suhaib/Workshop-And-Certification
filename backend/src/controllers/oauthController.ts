import { Response } from 'express';
import type { Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { prisma } from '../index';

export class OAuthController {
  // ============ GOOGLE CALLBACK ============
  static googleCallback = (req: Request, res: Response): void => {
    try {
      const user = req.user;
      const isAdminLogin =
        req.query.state === 'admin_login' ||
        (req.session as any)?.oauthPurpose === 'admin';

      if (req.session) {
        (req.session as any).oauthPurpose = undefined;
      }

      if (!user || !user.token) {
        const errorPath = isAdminLogin ? '/auth/admin-login' : '/auth/login';
        res.redirect(`http://localhost:3000${errorPath}?error=Authentication failed`);
        return;
      }

      if (isAdminLogin && user.role !== 'SUPER_ADMIN' && user.role !== 'MODERATOR') {
        res.redirect(
          `http://localhost:3000/auth/admin-login?error=Insufficient+permissions.+Only+selected+emails+can+access+the+admin+panel.`
        );
        return;
      }

      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const callbackPath = isAdminLogin ? '/auth/admin-callback' : '/auth/callback';
      const redirectURL = `${frontendURL}${callbackPath}?token=${encodeURIComponent(
        user.token
      )}&user=${encodeURIComponent(
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        })
      )}${isAdminLogin ? '&admin=true' : ''}`;

      res.redirect(redirectURL);
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      const errorPath = (req.session as any)?.oauthPurpose === 'admin' ? '/auth/admin-login' : '/auth/login';
      res.redirect(`http://localhost:3000${errorPath}?error=Authentication error`);
    }
  };

  // ============ GOOGLE AUTH FAILURE ============
  static googleAuthFailure = (req: Request, res: Response): void => {
    console.error('❌ Google authentication failed');
    const isAdminLogin =
      req.query.state === 'admin_login' ||
      (req.session as any)?.oauthPurpose === 'admin';
    const errorPath = isAdminLogin ? '/auth/admin-login' : '/auth/login';
    res.redirect(
      `http://localhost:3000${errorPath}?error=Google authentication failed`
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