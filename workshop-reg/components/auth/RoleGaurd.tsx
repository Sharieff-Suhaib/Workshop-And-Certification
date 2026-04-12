// workshop-reg/src/components/auth/RoleGuard.tsx

'use client';

import { ReactNode } from 'react';
import { useAdminAuthStore } from '../../lib/store/adminAuthStore';

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles: Array<'SUPER_ADMIN' | 'MODERATOR'>;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  requiredRoles,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole } = useAdminAuthStore();

  if (!hasRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}