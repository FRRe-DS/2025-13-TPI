// NO hace falta "use client" acá porque no usamos hooks ni window,
// solo constantes y funciones puras.

const KC_BASE =
  process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL ?? 'http://keycloak:8080';

const KC_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? 'ds-2025-realm';

const KC_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'grupo-13';

export const KC_REDIRECT_URI =
  process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI ??
  'http://localhost:3000/auth/callback';

export const KC_POST_LOGOUT_REDIRECT =
  process.env.NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT ??
  'http://localhost:3000/';

export const KC_AUTH_URL = `${KC_BASE}/realms/${KC_REALM}/protocol/openid-connect/auth`;
export const KC_LOGOUT_URL = `${KC_BASE}/realms/${KC_REALM}/protocol/openid-connect/logout`;

export function buildLoginUrl(): string {
  const params = new URLSearchParams({
    client_id: KC_CLIENT_ID,
    redirect_uri: KC_REDIRECT_URI,
    response_type: 'code',
    scope: [
      'openid',
      'usuarios:read',
      'usuarios:write',
      'compras:read',
      'compras:write',
      'productos:read',
      'productos:write',
      'categorias:read',
      'categorias:write',
      'reservas:read',
      'reservas:write',
      'stock:read',
      'stock:write',
      'envios:read',
      'envios:write',
    ].join(' '),
  });

  return `${KC_AUTH_URL}?${params.toString()}`;
}


export function buildRegisterUrl(): string {
  const url = new URL(buildLoginUrl());
  url.searchParams.set('kc_action', 'register'); // abre directamente registro
  return url.toString();
}

export function buildLogoutUrl(): string {
  const params = new URLSearchParams({
    client_id: KC_CLIENT_ID,
    post_logout_redirect_uri: KC_POST_LOGOUT_REDIRECT,
  });

  return `${KC_LOGOUT_URL}?${params.toString()}`;
}

