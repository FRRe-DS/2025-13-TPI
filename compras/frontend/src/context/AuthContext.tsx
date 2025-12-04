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
import {
  buildLoginUrl,
  buildLogoutUrl,
  KC_REDIRECT_URI,
} from '../../lib/keycloak';

import { jwtDecode } from 'jwt-decode';

// ============================
// TIPOS
// ============================

interface User {
  id: string;
  nombre: string;
  email: string;
}

type DecodedKC = {
  sub: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
};

function buildUserFromToken(token: string): User | null {
  try {
    const decoded = jwtDecode<DecodedKC>(token);
    console.log('TOKEN DECODIFICADO:', decoded); // 👈 seguí mirando esto en consola

    const email =
      decoded.email ||
      decoded.preferred_username ||
      decoded.sub || // al menos algo único
      '';

    const nombre =
      decoded.name ||
      decoded.given_name ||
      decoded.preferred_username ||
      (decoded.sub ? `Usuario ${decoded.sub.slice(0, 6)}` : 'Usuario autenticado');

    return {
      id: decoded.sub ?? '0',
      nombre,
      email,
    };
  } catch (e) {
    console.error('Error al decodificar el token JWT:', e);
    return null;
  }
}



// ============================
// CONTEXTO
// ============================

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  finishLoginFromCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

// ============================
// PROVIDER
// ============================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Limpia token local
  const logoutLocal = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  // Logout completo (incluye Keycloak)
  const logout = useCallback(() => {
    logoutLocal();
    const url = buildLogoutUrl();
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }, [logoutLocal]);

  // Obtener datos del backend (no rompe si falla)
  const fetchUser = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.warn(
          'No se pudo obtener /api/users/me:',
          res.status,
          body || res.statusText
        );
        // No romper sesión
        return;
      }

      const raw = await res.json();
      console.log('USER FROM /me:', raw);

      const mappedUser: User = {
        id: String(raw.id ?? raw.sub ?? ''),
        nombre:
          raw.nombre ??
          raw.name ??
          raw.given_name ??
          raw.username ??
          raw.preferred_username ??
          'Usuario',
        email:
          raw.email ??
          raw.correo ??
          raw.username ??        // 👈 si tu backend manda "username"
          raw.nombre ??          // 👈 último fallback
          'Invitado',
      };


      setUser(mappedUser);
    } catch (error) {
      console.error('Error al obtener usuario desde /me:', error);
    }
  }, []);

  // Cargar token guardado al abrir app
  useEffect(() => {
    const storedToken =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (storedToken) {
      setToken(storedToken);

      const baseUser = buildUserFromToken(storedToken);
      if (baseUser) setUser(baseUser);

      fetchUser(storedToken); // sin romper sesión si falla
    }

    setIsLoading(false);
  }, [fetchUser]);

  // ============================
  // LOGIN POR KEYCLOAK
  // ============================
  const login = useCallback(() => {
    const url = buildLoginUrl();
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }, []);

  // ============================
  // LOGIN CON CREDENCIALES (backend propio)
  // ============================
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
          const body = await res.json().catch(() => ({}));
          console.error('Error loginWithCredentials:', body);
          throw new Error('Credenciales inválidas');
        }

        const data = await res.json();
        const accessToken = data.access_token;

        if (!accessToken) {
          throw new Error('El backend no devolvió access_token');
        }

        localStorage.setItem('token', accessToken);
        setToken(accessToken);

        const baseUser = buildUserFromToken(accessToken);
        if (baseUser) setUser(baseUser);

        fetchUser(accessToken);
        router.replace('/dashboard');
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser, router]
  );

  // ============================
// FINISH LOGIN (KEYCLOAK CALLBACK)
// ============================
const finishLoginFromCode = useCallback(
  async (code: string) => {
    setIsLoading(true);

    try {
      // 1) Intercambiamos el "code" por tokens en tu backend
      const res = await fetch(`${API_BASE_URL}/api/auth/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          redirect_uri: KC_REDIRECT_URI,
        }),
      });

      if (!res.ok) {
        console.error('Error en exchange');
        throw new Error('No se pudo intercambiar el code por token');
      }

      // 2) Obtenemos el access_token de la respuesta
      const data = await res.json();
      const accessToken: string | undefined = data.access_token;

      if (!accessToken) {
        throw new Error('Keycloak no devolvió un access_token');
      }

      // 3) Guardamos token y actualizamos estado
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // 4) Decodificamos el usuario desde el token
      const baseUser = buildUserFromToken(accessToken);
      console.log('🔥 USUARIO DECODIFICADO DESDE TOKEN:', baseUser);
      if (baseUser) setUser(baseUser);

      // 5) (Opcional) pedimos datos extra al backend
      fetchUser(accessToken);

      // 6) Redirigimos a dashboard
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


  
  // ============================
  // RETURN PROVIDER
  // ============================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginWithCredentials,
        logout,
        finishLoginFromCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================
// HOOK DE USO
// ============================

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
