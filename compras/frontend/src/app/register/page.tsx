'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.nombre,
          lastName: formData.apellido,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        if (res.status === 400) throw new Error('El Correo ya está registrado');
        if (res.status === 422) throw new Error('Los datos enviados no son válidos');
        if (res.status >= 500) throw new Error('Error interno del servidor');

        throw new Error(errorData.detail || 'Error al registrarse');
      }
      const data = await res.json();
      setSuccess('Cuenta creada exitosamente! Redirigiendo...');
      localStorage.setItem('token', data.access_token);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al registrarse');
      }
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 py-2">Crear una cuenta nueva</h2>
            <p className="text-gray-500">
              ¿Ya tienes una cuenta?
              <a href="/login" className="text-blue-500 hover:underline font-medium">
                {' '}
                Inicia sesión
              </a>
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre "
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-500 placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-500 placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-500 placeholder:text-gray-300 placeholder:font-medium"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-500 placeholder:text-gray-300 placeholder:font-medium"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                Crear cuenta
              </button>
              {error && (
                <div className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md border border-red-300">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-sm text-center text-green-600 bg-green-100 p-2 rounded-md border border-green-300">
                  {success}
                </div>
              )}
              {isLoading && <div className="text-sm text-center text-gray-600">Procesando...</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
