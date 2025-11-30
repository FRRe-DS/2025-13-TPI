'use client';

import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
        <p className="text-gray-600 mb-6 text-center">
          Vas a ser redirigido a la página de inicio de sesión de Keycloak.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirigiendo...' : 'Iniciar sesión con Keycloak'}
          </button>
        </form>
      </div>
    </div>
  );
}
