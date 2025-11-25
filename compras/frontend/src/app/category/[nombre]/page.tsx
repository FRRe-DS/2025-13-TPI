'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';

// ========= Tipos usados por el FRONT =========

interface ProductImage {
  url: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: ProductImage[];
}

// ========= Tipos que vienen del BACK DE STOCK (8001/v1) =========

interface BackendImage {
  id: number;
  url: string;
  esPrincipal: boolean;
  productoId: number;
}

interface BackendCategoria {
  id: number;
  nombre: string;
  descripcion: string;
}

interface BackendProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stockDisponible: number;
  categorias?: BackendCategoria[];
  imagenes?: BackendImage[];
}

export default function CategoryPage() {
  const params = useParams<{ nombre: string }>();
  const router = useRouter();

  // nombre viene encodeado (Utensilios%20Cocina)
  const rawNombre = params.nombre;
  const decodedNombre =
    typeof rawNombre === 'string'
      ? decodeURIComponent(rawNombre)
      : Array.isArray(rawNombre)
      ? decodeURIComponent(rawNombre[0])
      : '';

  const [productos, setProductos] = useState<Product[]>([]);
  const [ordenar, setOrdenar] = useState('destacado');

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const API_URL =
    rawApiUrl && rawApiUrl.trim() !== ''
      ? rawApiUrl
      : 'http://localhost:8001/v1';

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/productos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: BackendProducto[] = await res.json();

        // Filtramos productos que tengan ALGUNA categoría con ese nombre
        const filtradosBackend = data.filter((p) =>
          p.categorias?.some(
            (cat) =>
              cat.nombre.trim().toLowerCase() ===
              decodedNombre.trim().toLowerCase()
          )
        );

        const mapped: Product[] = filtradosBackend.map((p) => {
          const precioNumber = Number(p.precio.replace(',', '.'));

          const principalCategoria =
            p.categorias?.[0]?.nombre ?? 'Sin categoría';

          const images: ProductImage[] = (p.imagenes ?? []).map((img) => ({
            url: img.url,
            is_primary: img.esPrincipal,
          }));

          return {
            id: p.id,
            name: p.nombre,
            price: isNaN(precioNumber) ? 0 : precioNumber,
            category: principalCategoria,
            images,
          };
        });

        setProductos(mapped);
      } catch (err) {
        console.error('Error al obtener productos desde STOCK:', err);
      }
    };

    if (decodedNombre) {
      fetchProductos();
    }
  }, [API_URL, decodedNombre]);

  const imagenProducto = (p: Product) => {
    const primary = p.images.find((i) => i.is_primary)?.url;
    const fallback = p.images[0]?.url;
    const final = primary || fallback || '/placeholder.png';
    return final.startsWith('http') ? final : `${API_URL}${final}`;
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    switch (ordenar) {
      case 'menor-precio':
        return a.price - b.price;
      case 'mayor-precio':
        return b.price - a.price;
      case 'nombre':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="hover:text-gray-900"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => router.push('/category')}
            className="hover:text-gray-900"
          >
            Categorías
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold capitalize">
            {decodedNombre}
          </span>
        </nav>

        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
          {decodedNombre}
        </h1>

        {/* SELECTOR ORDEN */}
        <div className="flex justify-end mb-6">
          <div className="relative">
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="appearance-none bg-white text-gray-700 border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
            >
              <option value="destacado">Destacado</option>
              <option value="menor-precio">Menor precio</option>
              <option value="mayor-precio">Mayor precio</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        {productosOrdenados.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay productos disponibles en esta categoría.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosOrdenados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => router.push(`/product/${producto.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={imagenProducto(producto)}
                    alt={producto.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {producto.name}
                  </h3>
                  <div className="text-xl font-bold text-gray-900">
                    ${producto.price.toLocaleString('es-ES')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
