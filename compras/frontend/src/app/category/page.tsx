'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildImageUrl } from '@/utils/imageUrl';

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

interface BackendDimensiones {
  largoCm: string;
  anchoCm: string;
  altoCm: string;
}

interface BackendUbicacion {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
}

interface BackendProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // "1499.99"
  stockDisponible: number;
  pesoKg?: string;
  dimensiones?: BackendDimensiones;
  ubicacion?: BackendUbicacion;
  categorias?: BackendCategoria[];
  imagenes?: BackendImage[];
}

export default function CatalogoAccesorios() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [ordenar, setOrdenar] = useState('destacado');
  const [precioDesde, setPrecioDesde] = useState('');
  const [precioHasta, setPrecioHasta] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔍 texto que viene de /category?search=...
  const searchQuery = (searchParams.get('search') || '').toLowerCase();

  // Base de la API → STOCK
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const API_URL =
    rawApiUrl && rawApiUrl.trim() !== ''
      ? rawApiUrl
      : 'http://localhost:8001/v1';

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/productos`);
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data: BackendProducto[] = await res.json();
        console.log('Listado de productos desde STOCK:', data);

        const mapped: Product[] = data.map((p) => {
          const categoriaPrincipal =
            p.categorias && p.categorias.length > 0
              ? p.categorias[0].nombre
              : 'Sin categoría';

          const precioNumber = Number(p.precio.replace(',', '.'));

          const images: ProductImage[] = (p.imagenes ?? []).map((img) => ({
            url: img.url,
            is_primary: img.esPrincipal,
          }));

          return {
            id: p.id,
            name: p.nombre,
            price: isNaN(precioNumber) ? 0 : precioNumber,
            category: categoriaPrincipal,
            images,
          };
        });

        setProductos(mapped);
      } catch (err) {
        console.error('Error al obtener productos desde STOCK:', err);
      }
    };

    fetchProductos();
  }, [API_URL]);

  const categorias = Array.from(
    new Set(productos.map((p) => p.category))
  ).filter(Boolean);

  // 🔎 Filtro combinado: categoría + precio + búsqueda por texto
  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = categoriaSeleccionada
      ? p.category === categoriaSeleccionada
      : true;

    const desde = precioDesde ? parseFloat(precioDesde) : 0;
    const hasta = precioHasta ? parseFloat(precioHasta) : Infinity;

    const nombre = p.name.toLowerCase();
    const categoria = p.category.toLowerCase();

    const coincideBusqueda = searchQuery
      ? nombre.includes(searchQuery) || categoria.includes(searchQuery)
      : true;

    return coincideCategoria && coincideBusqueda && p.price >= desde && p.price <= hasta;
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
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

  // 🔹 función auxiliar para mostrar la imagen del producto
  const imagenProducto = (producto: Product) => {
    const primary = producto.images.find((img) => img.is_primary);
    const candidate = primary ?? producto.images[0];

    if (!candidate || !candidate.url) {
      console.log('Producto sin imágenes en catálogo →', producto.name);
      return '/placeholder.png';
    }

    const raw = candidate.url;
    const finalUrl = buildImageUrl(raw);

    console.log('Imagen catálogo →', producto.name, { raw, finalUrl });
    return finalUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <a href="/dashboard" className="hover:text-gray-900">
            Home
          </a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Categorías</span>
        </nav>

        {/* Si viene búsqueda, lo mostramos arriba como contexto */}
        {searchQuery && (
          <p className="text-sm text-gray-700 mb-4">
            Resultados para: <span className="font-semibold">&quot;{searchQuery}&quot;</span>
          </p>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 🔹 FILTRO IZQUIERDO */}
          <div className="lg:col-span-1 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              CATEGORÍAS
            </h1>
            <div className="space-y-2">
              {categorias.map((nombre, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCategoriaSeleccionada(nombre);
                    // si querés, podrías también actualizar la URL con ?category=...
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    categoriaSeleccionada === nombre
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {nombre}
                </button>
              ))}
            </div>

            {/* 🔹 FILTRO PRECIO */}
            <div className="w-full px-2">
              <p className="font-semibold mb-1 text-sm text-black">
                Filtrar por precio
              </p>
              <div className="w-full flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Desde"
                  value={precioDesde}
                  onChange={(e) => setPrecioDesde(e.target.value)}
                  className="w-1/2 px-3 py-2 border text-gray-700 border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Hasta"
                  value={precioHasta}
                  onChange={(e) => setPrecioHasta(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* 🔹 PRODUCTOS */}
          <div className="lg:col-span-3">
            <div className="flex justify-end mb-6">
              <div className="relative">
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value)}
                  className="appearance-none text-gray-900 bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm"
                >
                  <option value="destacado">Destacado</option>
                  <option value="menor-precio">Menor precio</option>
                  <option value="mayor-precio">Mayor precio</option>
                  <option value="nombre">Nombre A-Z</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
              </div>
            </div>

            {productosOrdenados.length === 0 ? (
              <p className="text-gray-500 text-center">
                {searchQuery
                  ? `No se encontraron productos que coincidan con "${searchQuery}".`
                  : 'No hay productos disponibles.'}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosOrdenados.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => router.push(`/product/${producto.id}`)}
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <Image
                        src={imagenProducto(producto)}
                        alt={producto.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
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
      </div>
    </div>
  );
}
