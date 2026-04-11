import { Router } from 'express';
import passport from 'passport';
import { OAuthController } from '../controllers/oauthController';

const router = Router();

// ✅ Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
    session: true,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  OAuthController.googleCallback
);

router.get('/failure', OAuthController.googleAuthFailure);

// ✅ These endpoints MUST exist
router.get('/me', OAuthController.getCurrentUser);
router.post('/logout', OAuthController.logout);

export default router;