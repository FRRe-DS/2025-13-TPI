'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

interface RegisterResponse {
  access_token?: string;
  // si tu backend devuelve más campos, podés agregarlos acá
}

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== password2) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          detail?: string;
        };
        const detail = data.detail || 'No se pudo crear el usuario.';
        throw new Error(detail);
      }

      const tokens = (await res.json()) as RegisterResponse;
      const accessToken = tokens.access_token;

      if (!accessToken) {
        throw new Error('No se recibió access_token desde el backend.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
      }

      router.replace('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Error al registrar usuario.');
      } else {
        setErrorMsg('Error al registrar usuario.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Lado izquierdo tipo hero (igual que login) */}
      <div className="hidden md:flex flex-1 flex-col justify-center bg-[#3e3e3e] px-12 text-white bg-[url('/fondo.png')] bg-cover bg-no-repeat bg-[position:-1050%_center]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div>
            <Image
              src="/fondo2.png"
              alt="Logo de ComprasApp"
              width={200}
              height={200}
              className="w-124 h-124"
              priority
            />
          </div>
        </div>
      </div>

      {/* Lado derecho: tarjeta de registro */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-[#d8d8d8]">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h1 className="text-3xl text-gray-700 font-bold mb-2 text-center">
            Crear cuenta
          </h1>
          <br />

          {errorMsg && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegisterForm} className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Juan"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Pérez"
                />
              </div>
            </div>

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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Repetir contraseña
              </label>
              <input
                id="password2"
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <div className="mb-4 text-sm flex text-gray-500 justify-center items-center">
            <p>
              ¿Ya tenés cuenta?{' '}
              <a href="/login" className="text-blue-700 hover:underline">
                Iniciá sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
