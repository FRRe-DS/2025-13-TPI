'use client';

import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Accede a tu cuenta
        </h2>

        <p className="text-center text-gray-600 text-sm mb-6">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
            Regístrate
          </a>
        </p>



          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirigiendo...' : 'Iniciar sesión con Keycloak'}
          </button>
      </div>
    </div>
  );
} 
