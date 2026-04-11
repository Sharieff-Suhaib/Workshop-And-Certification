import { Router } from 'express';
import passport from 'passport';
import { OAuthController } from '../controllers/oauthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Google OAuth - Initiate login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
    session: true,
  })
);

// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  OAuthController.googleCallback
);

// Failure handler
router.get('/failure', OAuthController.googleAuthFailure);

// Get current user (protected)
router.get('/me', authMiddleware, OAuthController.getCurrentUser);

// Logout (protected) - ✅ KEY ENDPOINT
router.post('/logout', authMiddleware, OAuthController.logout);

export default router;