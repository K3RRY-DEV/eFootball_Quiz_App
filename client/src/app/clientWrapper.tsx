"use client";

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Public auth pages
  const publicAuthRoutes = ['/login', '/signup'];
  const isAuthPage = publicAuthRoutes.includes(pathname);

  return (
    <>
      {isAuthPage ? (
        <ProtectedRoute publicOnly>{children}</ProtectedRoute>
      ) : (
        <ProtectedRoute>{children}</ProtectedRoute>
      )}
    </>
  );
}
