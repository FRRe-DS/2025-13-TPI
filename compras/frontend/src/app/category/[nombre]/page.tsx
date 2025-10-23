'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';

// 🧩 Interfaz de imagen relacionada
interface ProductImage {
  url?: string;
  is_primary?: boolean;
}

// 🧩 Interfaz de producto
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images?: ProductImage[];
}

export default function CategoryPage() {
  const { nombre } = useParams();
  const router = useRouter();

  const [productos, setProductos] = useState<Product[]>([]);
  const [ordenar, setOrdenar] = useState('destacado');
  const BASE_URL = 'http://127.0.0.1:8000';

  // 🟢 Traer productos desde el backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/product`)
      .then((res) => res.json())
      .then((data) => {
        const productosData = Array.isArray(data) ? data : data.data || [];
        const filtrados = productosData.filter(
          (p: Product) => p.category === nombre
        );
        setProductos(filtrados);
      })
      .catch((err) => console.error('Error al obtener productos:', err));
  }, [nombre]);

  // 🟢 Función para obtener imagen principal del producto
  const imagenProducto = (producto: Product) => {
    const primary = producto.images?.find((img) => img.is_primary)?.url;
    const fallback = producto.images?.[0]?.url;
    const final = primary || fallback || '/placeholder.png';
    // Si la URL no empieza con http, agregamos el BASE_URL
    return final.startsWith('http') ? final : `${BASE_URL}${final}`;
  };

  // 🟢 Ordenamiento
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
        {/* 🧭 Breadcrumb */}
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
          <span className="text-gray-900 font-semibold">{nombre}</span>
        </nav>

        {/* 🏷️ Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
          {nombre}
        </h1>

        {/* 🔽 Filtro de orden */}
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
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
          </div>
        </div>

        {/* 🧩 Grilla de productos */}
        {productosOrdenados.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay productos disponibles en esta categoría.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosOrdenados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={imagenProducto(producto)} // 👈 nueva función para buscar imagen relacionada
                    alt={producto.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {producto.name}
                  </h3>
                  <div className="text-xl font-bold text-gray-900 mb-1">
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
