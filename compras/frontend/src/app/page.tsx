'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario tiene sesión activa
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si tiene token, ir al dashboard
      router.push('/dashboard');
    } else {
      // Si no tiene token, ir al login
      router.push('/pages/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}