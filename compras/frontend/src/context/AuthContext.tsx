'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Se ejecuta una sola vez al cargar la app
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  fetchUser();
}, []);

  const fetchUser = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Token inválido');
      const data = await res.json();
      setUser(data);
      console.log('Consultando /auth/me con token:', token);
      console.log('Respuesta status:', res.status);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail === 'credenciales inválidas'
            ? 'Email o contraseña incorrecta'
            : errorData.detail || 'Error al iniciar sesión'
        );
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      await fetchUser(data.access_token);

      router.push('/dashboard');
    } catch (err) {
      console.error('Error en login:', err);
      logout(); // Limpia cualquier token viejo
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
