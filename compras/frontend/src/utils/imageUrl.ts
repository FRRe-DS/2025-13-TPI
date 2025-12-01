// src/utils/imageUrl.ts

// URL base de la API (la misma que usás en el resto del front)
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001/v1';
const API_URL =
  rawApiUrl && rawApiUrl.trim() !== ''
    ? rawApiUrl.trim()
    : 'http://localhost:8001/v1';

// BASE_URL sin el /v1 final → para recursos estáticos (imágenes)
const BASE_URL = API_URL.replace(/\/v1\/?$/, '');

export function buildImageUrl(rawUrl?: string | null): string {
  if (!rawUrl) return '/placeholder.png';

  const cleaned = rawUrl.trim();
  if (!cleaned) return '/placeholder.png';

  // 1) Ya viene con protocolo http/https
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }

  // 2) Viene como //dominio.com/imagen.jpg
  if (/^\/\//.test(cleaned)) {
    return `http:${cleaned}`;
  }

  // 3) Viene como "localhost:8001/uploads/imagen.jpg"
  if (/^[\w.-]+:\d+\//.test(cleaned)) {
    return `http://${cleaned}`;
  }

  // 4) Viene como ruta absoluta del server: "/uploads/imagen.jpg"
  if (cleaned.startsWith('/')) {
    return `${BASE_URL}${cleaned}`;
  }

  // 5) Viene como ruta relativa: "uploads/imagen.jpg"
  return `${BASE_URL}/${cleaned}`;
}
