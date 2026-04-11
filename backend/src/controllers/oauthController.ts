import { Response, Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';

export class OAuthController {
  // ============ GOOGLE CALLBACK ============
  static googleCallback = (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user || !user.token) {
        return res.redirect(
          `http://localhost:3000/auth/login?error=Authentication failed`
        );
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
  static googleAuthFailure = (req: Request, res: Response) => {
    console.error('❌ Google authentication failed');
    res.redirect(
      `http://localhost:3000/auth/login?error=Google authentication failed`
    );
  };

  // ============ GET CURRENT USER ============
  static getCurrentUser = (req: Request, res: Response) => {
    try {
      if (req.isAuthenticated?.()) {
        const user = req.user as any;
        sendSuccess(res, 200, {
          authenticated: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
          },
          sessionID: req.sessionID,
        });
      } else {
        sendSuccess(res, 200, { authenticated: false });
      }
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  };

  // ============ LOGOUT ✅ ============
  static logout = (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      const sessionID = req.sessionID;

      console.log(`🚪 Logging out user: ${userId}`);
      console.log(`📦 Session ID: ${sessionID}`);

      // Logout Passport session
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
          return sendError(res, 500, 'Logout failed');
        }

        // Destroy session
        req.session.destroy((err) => {
          if (err) {
            console.error('Session destroy error:', err);
            return sendError(res, 500, 'Session destruction failed');
          }

          console.log(`✅ User ${userId} logged out successfully`);

          // Clear cookie
          res.clearCookie('connect.sid');

          // Send response
          sendSuccess(res, 200, null, 'Logged out successfully');
        });
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      sendError(res, 500, error.message);
    }
  };
}