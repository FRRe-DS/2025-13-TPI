'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { finishLoginFromCode } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Error devuelto por Keycloak:', error);
      router.replace('/login?error=login_failed');
      return;
    }

    if (!code) {
      router.replace('/login?error=missing_code');
      return;
    }

    (async () => {
      try {
        await finishLoginFromCode(code);
        router.replace('/dashboard'); // o a donde quieras mandar después del login
      } catch {
        router.replace('/login?error=auth_failed');
      }
    })();
  }, [searchParams, router, finishLoginFromCode]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Completando inicio de sesión...</p>
    </div>
  );
}
