// backend/src/services/oauthService.ts
import { prisma } from '../index';
import { generateToken } from '../utils/jwt';
import { isAdminEmail } from '../config/adminWhitelist';

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

      // Determine role based on email whitelist
      const role = isAdminEmail(email) ? 'SUPER_ADMIN' : 'USER';

      // If user doesn't exist, create one
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: displayName || email.split('@')[0],
            password: '', // OAuth users don't have password
            profileImage: profileImage || null,
            role,
          },
        });
        console.log(`✅ New user created with role ${role}:`, email);
      } else {
        // Update profile image if not set
        if (!user.profileImage && profileImage) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { profileImage },
          });
        }

        // Update role if email is now whitelisted
        if (user.role !== role && isAdminEmail(email)) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role },
          });
          console.log(`✅ User role updated to ${role}:`, email);
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
      console.error('❌ OAuth Service Error:', error);
      throw error;
    }
  }
}