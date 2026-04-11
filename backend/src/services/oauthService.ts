import { prisma } from '../index';
import { generateToken } from '../utils/jwt';

export class OAuthService {
  // ============ GOOGLE CALLBACK SERVICE ============
  static async handleGoogleCallback(profile: any) {
    try {
      const email = profile.emails?.[0]?.value;
      const displayName = profile.displayName;
      const profileImage = profile.photos?.[0]?.value;

      if (!email) {
        throw new Error('Email not provided from Google');
      }

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      // If user doesn't exist, create one
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: displayName || email.split('@')[0],
            password: '', // OAuth users don't have password
            profileImage: profileImage || null,
            role: 'USER',
          },
        });
      } else {
        // Update profile image if not set
        if (!user.profileImage && profileImage) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { profileImage },
          });
        }
      }

      // Generate token
      const token = generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}