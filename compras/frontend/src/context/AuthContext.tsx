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

  // ✅ Ejecuta solo si hay token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ✅ Obtiene el usuario autenticado
  const fetchUser = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Token inválido');

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Inicio de sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
     const formData = new URLSearchParams();
formData.append('username', email);
formData.append('password', password);

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData.toString(),
});

      if (!res.ok) {
  const errorData = await res.json().catch(() => ({}));
  console.error('Error en respuesta de login:', errorData);

  const message = errorData?.detail
  ? Array.isArray(errorData.detail)
    ? (errorData.detail as { msg: string }[])
        .map((d) => d.msg)
        .join(', ')
    : String(errorData.detail)
  : 'Error al iniciar sesión';

  throw new Error(message);
}


      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      await fetchUser(data.access_token);

      router.push('/dashboard');
    } catch (err) {
      console.error('Error en login:', err);
      logout();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Cerrar sesión
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
