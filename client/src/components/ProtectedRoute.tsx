'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;      // for admin-only pages
  publicOnly?: boolean;       // for login/signup pages
}

const ProtectedRoute = ({ children, requiredRole, publicOnly }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (publicOnly) {
            // Guest-only page (login/signup) → allow
            setLoading(false);
            return;
          }
          // Protected page → redirect to login
          router.replace('/login');
          return;
        }

        // ✅ Verify with backend
        const res = await fetch('http://localhost:5000/api/auth/verify', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Invalid or expired token
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.replace('/login');
          return;
        }

        const data = await res.json();
        localStorage.setItem("role", data.role);

        // ✅ If page is publicOnly (login/signup) → redirect to dashboard
        if (publicOnly) {
          router.replace('/dashboard');
          return;
        }

        // ✅ If page requires a role
        if (requiredRole && data.role !== requiredRole) {
          router.replace('/unauthorized');
          return;
        }

        // All good → allow access
        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.replace('/login');
      }
    };

    verifyAuth();
  }, [router, requiredRole, publicOnly]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
