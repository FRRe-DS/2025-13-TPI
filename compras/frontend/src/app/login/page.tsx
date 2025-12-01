'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithCredentials, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginForm = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await loginWithCredentials(email, password);
      // si todo sale bien, el contexto te redirige a /dashboard
    } catch (err) {
      setErrorMsg('Correo o contraseña incorrectos.');
    }
  };

  const handleKeycloakRedirect = () => {
    login();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Lado izquierdo tipo hero */}
      <div className="hidden md:flex flex-1 flex-col justify-center bg-[#3e3e3e] px-12 text-white bg-[url('/fondo.png')] bg-cover bg-no-repeat bg-[position:-1050%_center]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className=""> 
            <img src="/fondo2.png" alt="Logo de ComprasApp" className="w-124 h-124 " /> 
          </div>
        </div>
      </div>

      {/* Lado derecho: tarjeta de login */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-[#d8d8d8] ">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h1 className="text-3xl text-gray-700 font-bold mb-2 text-center">
            Iniciar sesión
          </h1>
          <br />
          {errorMsg && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {errorMsg}
            </div>
          )}

          {/* Formulario propio */}
          <form onSubmit={handleLoginForm} className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="tucorreo@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
            <div className="mb-4 text-sm flex text-gray-500 justify-center items-center">
            <p>¿No tenés cuenta? {' '}
            <a href="/register" className="text-blue-700 hover:underline">
              Regístrate 
            </a>
            </p>
          </div>
          </form>          
        </div>
      </div>
    </div>
  );
}
