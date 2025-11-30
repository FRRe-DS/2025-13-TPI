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
  login: () => void;
  logout: () => void;              // logout “completo” (incluye Keycloak)
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

  // 🔹 1) Helper: limpiar solo el estado local y volver a /login
  const logoutLocal = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  // 🔹 2) Logout “público” que también cierra sesión en Keycloak
  const logout = useCallback(() => {
    logoutLocal();
    // Si además querés cerrar sesión global en Keycloak:
    const url = buildLogoutUrl();
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }, [logoutLocal]);

  // 🔹 3) Obtener datos del usuario desde tu backend
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
        // 👉 solo limpiamos estado y volvemos a /login, NO vamos a Keycloak /logout
        logoutLocal();
      } finally {
        setIsLoading(false);
      }
    },
    [logoutLocal]
  );

  // 🔹 4) Cargar token del localStorage en primer render
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

  // 🔹 5) Iniciar login: redirigir a Keycloak
  const login = useCallback(() => {
    const url = buildLoginUrl();
    // Podés usar router.push o location.href; router.push maneja mejor el history
    router.push(url);
  }, [router]);

  // 🔹 6) Recibir el "code" en /auth/callback y terminar el login
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

        // Traemos el usuario de tu backend
        await fetchUser(accessToken);

        // Si todo salió bien, vamos al dashboard
        router.replace('/dashboard'); // o la ruta que quieras post-login
      } catch (err) {
        console.error('Error en finishLoginFromCode:', err);
        // Solo limpiamos estado y volvemos a /login
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
        logout,           // este lo usás solo para el botón “Cerrar sesión”
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
