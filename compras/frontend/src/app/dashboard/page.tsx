'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { buildImageUrl } from '@/utils/imageUrl';

// ========= Tipos FRONT =========

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

// ========= Tipos BACK STOCK (8001/v1) =========

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
  precio: string; // "1499.99"
  stockDisponible: number;
  categorias?: BackendCategoria[];
  imagenes?: BackendImage[];
}

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isNewProductsHovered, setIsNewProductsHovered] = useState(false);

  const heroSlides = [
    {
      id: 0,
      title: 'Hasta 50% de descuentos en Electrónica',
      description:
        'Descubre las últimas ofertas en la mejor tecnología. Promoción por tiempo limitado.',
      buttonText: 'Explorar electrónica',
      bgColor: 'from-gray-100 to-emerald-50',
      imageColor: 'bg-emerald-900',
      image: 'Electronica.jpg',
      categorySearch: 'Electrónica', // 🔹 texto que usaremos en /category?search=
    },
    {
      id: 1,
      title: 'Nueva Colección de Moda',
      description: 'Explora las últimas tendencias en ropa y accesorios.',
      buttonText: 'Ver moda',
      bgColor: 'from-gray-100 to-emerald-50',
      imageColor: 'bg-purple-900',
      image: '/Moda.jpg',
      categorySearch: 'Moda',
    },
    {
      id: 2,
      title: 'Equipamiento Deportivo Premium',
      description:
        'Todo lo que necesitas para alcanzar tus metas. Calidad y rendimiento garantizado.',
      buttonText: 'Ver deportes',
      bgColor: 'from-gray-100 to-emerald-50',
      imageColor: 'bg-blue-900',
      image: '/Deportes.jpg',
      categorySearch: 'Deportes',
    },
  ];

  const categoryImages = [
    'electronicac.jpg',
    'Hogar.jpg',
    'Herramientas.jpg',
    'Juguetes.jpg',
  ];

  // URL base de STOCK
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const API_URL =
    rawApiUrl && rawApiUrl.trim() !== ''
      ? rawApiUrl
      : 'http://localhost:8001/v1';

  // Imagen de producto desde STOCK
  const imagenProducto = (producto: Product) => {
    const primary = producto.images.find((img) => img.is_primary);
    const candidate = primary ?? producto.images[0];

    if (!candidate || !candidate.url) return '/placeholder.png';
    return buildImageUrl(candidate.url);
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const url = `${API_URL}/productos`;
        console.log('🏠 HomePage llamando a STOCK:', url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`STOCK respondió ${res.status}`);
        }

        const data: BackendProducto[] = await res.json();

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

        const cats = Array.from(new Set(mapped.map((p) => p.category))).filter(
          Boolean
        );
        setCategorias(cats);
        setError(null);
      } catch (err) {
        console.error('Error al obtener productos en HomePage:', err);
        setError(
          err instanceof Error ? err.message : 'Error desconocido al cargar datos'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [API_URL]);

  // “Nuevos productos” desde STOCK
  const newProducts = productos.slice(0, Math.min(16, productos.length));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div
        className={`bg-gradient-to-r ${heroSlides[currentSlide].bgColor} transition-all duration-500`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-gray-600 mb-6">
                {heroSlides[currentSlide].description}
              </p>
              {/* 🔹 Botón del hero navega a /category?search=... */}
              <button
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                onClick={() =>
                  router.push(
                    `/category?search=${encodeURIComponent(
                      heroSlides[currentSlide].categorySearch
                    )}`
                  )
                }
              >
                {heroSlides[currentSlide].buttonText}
              </button>
              <div className="flex gap-2 mt-4">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-gray-400 w-6'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              className={`relative h-80 ${heroSlides[currentSlide].imageColor} rounded-2xl overflow-hidden transition-colors duration-500`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={heroSlides[currentSlide].image}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de carga / error */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      )}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-500">Error al cargar productos: {error}</p>
        </div>
      )}

      {/* Categories (desde productos, con imágenes fijas) */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explora Nuestras Categorías
          </h2>

          {categorias.length === 0 ? (
            <p className="text-gray-500">No hay categorías disponibles.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categorias.slice(0, 4).map((cat, idx) => (
                <div
                  key={cat}
                  className="relative rounded-2xl h-48 overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
                  // 🔹 Click en categoría → /category?search=<nombre>
                  onClick={() =>
                    router.push(
                      `/category?search=${encodeURIComponent(cat)}`
                    )
                  }
                >
                  <Image
                    src={categoryImages[idx]}
                    alt={cat}
                    fill
                    className="object-cover group-hover:brightness-75 transition"
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-4">
                    <h3 className="text-xl font-semibold text-white">{cat}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Products */}
      {!loading && !error && newProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nuevos Productos
          </h2>
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsNewProductsHovered(true)}
            onMouseLeave={() => setIsNewProductsHovered(false)}
          >
            <div
              className="flex gap-6 animate-scroll"
              style={{
                width: `${newProducts.length * 250}px`,
                animationPlayState: isNewProductsHovered ? 'paused' : 'running',
              }}
            >
              {[...newProducts, ...newProducts].map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer flex-shrink-0 w-56"
                  // 🔹 Click en producto → /product/<id>
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <div className="h-48 flex items-center justify-center relative">
                    <Image
                      src={imagenProducto(product)}
                      alt={product.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      $
                      {product.price.toLocaleString('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
