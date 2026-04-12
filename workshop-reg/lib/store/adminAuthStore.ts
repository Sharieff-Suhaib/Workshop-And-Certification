
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'USER' | 'MODERATOR' | 'SUPER_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt?: string;
}

interface AdminAuthStore {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AdminUser) => void;
  setToken: (token: string) => void;
  setAdminData: (user: AdminUser, token: string) => void;
  logout: () => void;
  hasRole: (requiredRoles: UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => set({ token }),

      setAdminData: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      hasRole: (requiredRoles) => {
        const { user } = get();
        if (!user) return false;
        return requiredRoles.includes(user.role);
      },

      isSuperAdmin: () => {
        const { user } = get();
        return user?.role === 'SUPER_ADMIN';
      },

      isModerator: () => {
        const { user } = get();
        return user?.role === 'MODERATOR' || user?.role === 'SUPER_ADMIN';
      },
    }),
    {
      name: 'admin-auth-store',
    }
  )
);