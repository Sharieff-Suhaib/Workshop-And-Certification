'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/authStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setIsHydrated = useAuthStore((state) => state.setIsHydrated);

  useEffect(() => {
    // Force hydration
    setMounted(true);
    
    // Double-check hydration
    if (!isHydrated) {
      console.log('⚠️ Not hydrated yet, forcing...');
      setIsHydrated(true);
    }
  }, [isHydrated, setIsHydrated]);

  if (!mounted) {
    console.log('⏳ Not mounted yet');
    return null;
  }

  return <>{children}</>;
}