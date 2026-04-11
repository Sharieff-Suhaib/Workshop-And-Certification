import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../index';
import { generateToken } from '../utils/jwt';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ ERROR: Google OAuth credentials are missing in .env');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID || '',
      clientSecret: CLIENT_SECRET || '',
      callbackURL: CALLBACK_URL || 'http://localhost:5000/oauth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const displayName = profile.displayName;
        const profileImage = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('Email not provided from Google'));
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: displayName || email.split('@')[0],
              password: '',
              profileImage: profileImage || null,
              role: 'USER',
            },
          });
          console.log('✅ New user created:', email);
        } else {
          if (!user.profileImage && profileImage) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { profileImage },
            });
          }
        }

        const token = generateToken(user.id);

        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          token,
        };

        return done(null, userData);
      } catch (error) {
        console.error('❌ Google OAuth Error:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;