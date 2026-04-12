// workshop-reg/src/lib/rbac.ts

import { UserRole } from './store/adminAuthStore';

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface RBACRoles {
  SUPER_ADMIN: {
    workshops: Permission;
    participants: Permission;
    certificates: Permission;
    reports: Permission;
    users: Permission;
    settings: Permission;
  };
  MODERATOR: {
    workshops: Permission;
    participants: Permission;
    certificates: Permission;
    reports: Permission;
    users: Permission;
    settings: Permission;
  };
  USER: {
    workshops: Permission;
    participants: Permission;
    certificates: Permission;
    reports: Permission;
    users: Permission;
    settings: Permission;
  };
}

export const RBAC_PERMISSIONS: RBACRoles = {
  SUPER_ADMIN: {
    workshops: { create: true, read: true, update: true, delete: true },
    participants: { create: true, read: true, update: true, delete: true },
    certificates: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
    settings: { create: true, read: true, update: true, delete: true },
  },
  MODERATOR: {
    workshops: { create: true, read: true, update: true, delete: false },
    participants: { create: false, read: true, update: true, delete: false },
    certificates: { create: true, read: true, update: false, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
  },
  USER: {
    workshops: { create: false, read: true, update: false, delete: false },
    participants: { create: false, read: true, update: false, delete: false },
    certificates: { create: false, read: true, update: false, delete: false },
    reports: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
  },
};

export const hasPermission = (
  role: UserRole,
  resource: keyof RBACRoles['SUPER_ADMIN'],
  action: keyof Permission
): boolean => {
  return RBAC_PERMISSIONS[role]?.[resource]?.[action] ?? false;
};

export const canAccess = (
  role: UserRole,
  resource: keyof RBACRoles['SUPER_ADMIN']
): boolean => {
  return RBAC_PERMISSIONS[role]?.[resource]?.read ?? false;
};

export const getAdminRoutes = (role: UserRole): string[] => {
  const routes = ['/admin/dashboard'];

  if (hasPermission(role, 'workshops', 'read')) {
    routes.push('/admin/workshops');
  }
  if (hasPermission(role, 'participants', 'read')) {
    routes.push('/admin/participants');
  }
  if (hasPermission(role, 'certificates', 'read')) {
    routes.push('/admin/certificates');
  }
  if (hasPermission(role, 'reports', 'read')) {
    routes.push('/admin/reports');
  }

  return routes;
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'MODERATOR':
      return 'Moderator';
    case 'USER':
      return 'User';
    default:
      return 'Unknown';
  }
};

export const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Full access to all features and settings';
    case 'MODERATOR':
      return 'Can manage workshops, participants, and certificates';
    case 'USER':
      return 'Can view workshops and certificates';
    default:
      return 'No access';
  }
};