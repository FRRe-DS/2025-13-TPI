'use client';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function Signup() {
  const [formData, setFormData] = useState({
      nombre: '',
    apellido: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Datos del formulario:', formData);
    // Aca va la lógica de registro
  };

  const handleGoogleSignup = () => {
    console.log('Registro con Google');
    // Aca va la lógica de registro con Google
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 py-2">
              Crear una cuenta nueva
            </h2>
            <p className="text-gray-500">
              ¿Ya tienes una cuenta?
              <a href="/pages/login" className="text-blue-500 hover:underline font-medium"> Iniciar sesión
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400 placeholder:font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400 placeholder:font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400 placeholder:font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400 placeholder:font-medium"
                />
              </div>

              
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-200"
              >
                Crear cuenta
              </button>

              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">O continuar con</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignup}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md border border-gray-300 transition duration-200 flex items-center justify-center space-x-2"
              >
                <FcGoogle size={20}/>
                <span>Continuar con Google</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}