'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Aca va la logica para manejar el login
    try {
      // Ejemplo de llamada al backend
      // const response = await axios.post('http://localhost:8000/api/login', {
      //   email,
      //   password
      // });
      
      console.log('Login:', { email, password, rememberMe });
      
      // Simular login exitoso - guardar token
      localStorage.setItem('token', 'ejemplo-jwt-token');
      
      // Redirigir al dashboard después del login
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="text-blue-500 w-8 h-8" />  
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Accede a tu cuenta
        </h2>
        
         <p className="text-center text-gray-600 text-sm mb-6">
          ¿No tienes una cuenta?{' '}
          <a href="/pages/register" className="text-blue-500 hover:text-blue-600 font-medium">
            Regístrate
          </a>
        </p>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Recuérdame</span>
            </label>
            <a 
              href="/forgot-password" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}