'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        // Si no hay token, redirigir a login
        router.push('/pages/login');
        return;
      }
      
      setIsAuth(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Mostrar loader mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya redirigió)
  if (!isAuth) {
    return null;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}