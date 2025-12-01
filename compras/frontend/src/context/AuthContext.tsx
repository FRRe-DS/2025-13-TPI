'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { buildLoginUrl, buildLogoutUrl, KC_REDIRECT_URI } from '../../lib/keycloak';

interface User {
  id: number;
  nombre: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  // 👉 login por redirección a Keycloak (como ya tenías)
  login: () => void;
  // 👉 login directo con usuario/contraseña (nuevo)
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  finishLoginFromCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Limpiar solo estado local y volver a /login
  const logoutLocal = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  // 🔹 Logout completo (incluye Keycloak)
  const logout = useCallback(() => {
    logoutLocal();
    const url = buildLogoutUrl();
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }, [logoutLocal]);

  // 🔹 Obtener datos del usuario desde tu backend
  const fetchUser = useCallback(
    async (accessToken: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          throw new Error('Token inválido');
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        logoutLocal();
      } finally {
        setIsLoading(false);
      }
    },
    [logoutLocal]
  );

  // 🔹 Cargar token del localStorage en el primer render
  useEffect(() => {
    const storedToken =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  // 🔹 Login por redirección a Keycloak (flujo que ya tenías)
  const login = useCallback(() => {
    const url = buildLoginUrl();
    router.push(url);
  }, [router]);

  // 🔹 NUEVO: login con email/contraseña contra tu backend
  const loginWithCredentials = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}));
          console.error('Error en loginWithCredentials:', errorBody);
          throw new Error('Credenciales inválidas');
        }

        const data = await res.json();
        const accessToken: string | undefined = data.access_token;

        if (!accessToken) {
          throw new Error('El backend no devolvió access_token');
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', accessToken);
        }
        setToken(accessToken);

        await fetchUser(accessToken);
        router.replace('/dashboard'); // o la ruta que quieras post-login
      } catch (err) {
        console.error(err);
        // si hay error, dejamos al usuario en /login
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser, router]
  );

  // 🔹 Recibir el "code" en /auth/callback y terminar el login (flujo redirect)
  const finishLoginFromCode = useCallback(
    async (code: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirect_uri: KC_REDIRECT_URI,
          }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          console.error('Error en exchange:', error);
          throw new Error('No se pudo intercambiar el code por token');
        }

        const data = await res.json();
        const accessToken: string | undefined = data.access_token;

        if (!accessToken) {
          throw new Error('Keycloak no devolvió access_token');
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', accessToken);
        }
        setToken(accessToken);

        await fetchUser(accessToken);

        router.replace('/dashboard');
      } catch (err) {
        console.error('Error en finishLoginFromCode:', err);
        logoutLocal();
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser, logoutLocal, router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginWithCredentials, // 👉 nuevo
        logout,
        finishLoginFromCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
