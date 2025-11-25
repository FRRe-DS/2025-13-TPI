'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ====== Tipos normalizados para el FRONT ======

interface ProductImage {
  url: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku?: string;
  category: string;
  stock: number;
  images: ProductImage[];
}

// ====== Tipos que vienen del BACK DE STOCK (8001/v1) ======

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
  precio: string;           // viene como string: "1499.99"
  stockDisponible: number;
  pesoKg?: string;
  dimensiones?: BackendDimensiones;
  ubicacion?: BackendUbicacion;
  categorias?: BackendCategoria[];
  imagenes?: BackendImage[];
}

// Tipar los params de la ruta /product/[id]
type RouteParams = { id: string };

export default function ProductoDetalle() {
  const params = useParams<RouteParams>();
  const id = params.id;

  const [producto, setProducto] = useState<Product | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);

  // Esta URL apunta AL STOCK (8001/v1)
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const API_URL =
    rawApiUrl && rawApiUrl.trim() !== ''
      ? rawApiUrl
      : 'http://localhost:8001/v1';

  useEffect(() => {
    if (!id) return;

    const fetchProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/productos/${id}`);
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data: BackendProducto = await res.json();
        console.log('Producto desde STOCK:', data);

        // Mapeamos el BackendProducto (STOCK) al tipo Product del front
        const images: ProductImage[] = (data.imagenes ?? []).map((img) => ({
          url: img.url,
          is_primary: img.esPrincipal,
        }));

        const categoriaPrincipal =
          data.categorias && data.categorias.length > 0
            ? data.categorias[0].nombre
            : 'Sin categoría';

        const precioNumber = Number(data.precio.replace(',', '.'));

        const productMapped: Product = {
          id: data.id,
          name: data.nombre,
          description: data.descripcion,
          price: isNaN(precioNumber) ? 0 : precioNumber,
          sku: '', // si después tu backend agrega SKU, lo mapeás aquí
          category: categoriaPrincipal,
          stock: data.stockDisponible,
          images,
        };

        setProducto(productMapped);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id, API_URL]);

  if (loading) {
    return <div className="p-10 text-gray-500">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="p-10 text-gray-500">Producto no encontrado.</div>;
  }

  // Para armar URLs de imágenes solo usamos BASE_URL
  const BASE_URL = API_URL;

  const imagenes: ProductImage[] =
    producto.images && producto.images.length > 0
      ? producto.images.map((img) => {
          const rawUrl = img.url;
          const finalUrl =
            rawUrl && rawUrl.startsWith('http')
              ? rawUrl
              : rawUrl
              ? `${BASE_URL}${rawUrl}`
              : '/placeholder.png';

          return {
            url: finalUrl,
            is_primary: img.is_primary,
          };
        })
      : [{ url: '/placeholder.png', is_primary: true }];

  const imagenPrincipal =
    imagenes[imagenSeleccionada]?.url ??
    imagenes.find((img) => img.is_primary)?.url ??
    '/placeholder.png';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Migas de pan */}
        <nav className="flex items-center gap-2 text-sm mb-10">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            href="/category"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            {producto.category || 'Categoría'}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{producto.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Columna de imágenes */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-lg overflow-hidden aspect-[10/9] flex items-center justify-center shadow-sm border border-gray-200 bg-gray-50">
              <Image
                src={imagenPrincipal}
                alt={producto.name || 'Imagen del producto'}
                width={800}
                height={600}
                className="object-contain w-full h-full"
                unoptimized
              />
            </div>

            <div className="grid grid-cols-5 gap-4">
              {imagenes.map((img, index) => {
                const imageUrl = img.url || '/placeholder.png';

                return (
                  <button
                    key={index}
                    onClick={() => setImagenSeleccionada(index)}
                    className={`aspect-square w-20 h-20 rounded-lg flex items-center justify-center transition-all border-2 overflow-hidden ${
                      imagenSeleccionada === index
                        ? 'border-gray-900 shadow-md'
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                      unoptimized
                      priority
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna de información */}
          <div className="lg:col-span-5 space-y-8">
            {/* Título y precio */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
                {producto.name}
              </h1>
              <div className="text-3xl font-light text-gray-900">
                ${producto.price.toFixed(2)}
              </div>
            </div>

            {/* Descripción */}
            <div className="py-6 border-y border-gray-200">
              <h2 className="text-lg font-medium text-gray-500 mb-2">
                Descripción
              </h2>
              <p className="text-black leading-relaxed">
                {producto.description}
              </p>
            </div>

            {/* Datos técnicos */}
            <div className="grid grid-cols-2 gap-4 py-6 border-b border-gray-200">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  SKU
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {producto.sku || 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Disponibilidad
                </div>
                <div
                  className={`text-sm font-medium ${
                    producto.stock > 0 ? 'text-green-600' : 'text-red-600'
                  } ${
                    producto.stock < 6 && producto.stock > 0
                      ? 'text-yellow-600'
                      : ''
                  }`}
                >
                  {producto.stock === 0
                    ? 'Agotado'
                    : producto.stock < 6
                    ? 'Últimas Unidades'
                    : 'En stock'}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Categoría
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {producto.category}
                </div>
              </div>
            </div>

            {/* Cantidad y botón */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Cantidad
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) =>
                      setCantidad(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center text-gray-900 border border-gray-300 rounded h-10 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gray-900 text-white py-4 px-8 rounded hover:bg-gray-800 transition-all font-medium tracking-wide">
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
