"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User } from "lucide-react";


interface ProductImage {
  url?: string;
  is_primary?: boolean;
}

interface Product {
  id: number | string;
  name: string;
  price?: number;
  stock?: number;
  main_image_url?: string | null;
  images?: ProductImage[];
}

interface Category {
  id: number | string;
  name: string;
  description?: string;
  image_url?: string;
}

export default function Compras() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000";

  const imagenCategoria = (url?: string) => {
    if (!url) return "/placeholder.png";
    const fixed = url.replace(/\\/g, "/"); // 👈 reemplaza \ por /
    return fixed.startsWith("http") ? fixed : `${BASE_URL}${fixed}`;
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProd] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/category"),
          fetch("http://127.0.0.1:8000/api/product"),
        ]);

        if (!resCat.ok || !resProd.ok) throw new Error("Error al cargar datos");

        const [catsData, prodData] = await Promise.all([
          resCat.json(),
          resProd.json(),
        ]);

        setCategorias(catsData);
        setProductos(prodData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  const container = carouselRef.current;
  if (!container || isPaused) return;

  const autoScroll = setInterval(() => {
    const maxScroll = container.scrollWidth / 2; // solo la mitad, porque duplicamos productos

    if (container.scrollLeft >= maxScroll) {
      // Reinicia al principio sin que se note 
      container.scrollTo({ left: 0, behavior: "auto" });
    } else {
      container.scrollBy({ left: 1, behavior: "auto" });
    }
  }, 15);

  return () => clearInterval(autoScroll);
}, [isPaused]);


if (loading || error) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {loading && <p className="text-gray-600 text-lg font-medium">Cargando datos...</p>}
      {error && <p className="text-red-500 text-lg font-medium">{error}</p>}
    </div>
  );
  }


  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Compras</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Inicio
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Categorías
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Ofertas
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 rounded-md border border-gray-300 bg-red-100 text-sm text-gray-700 hover:text-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
              <button className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos, marcas y más"
              className="w-full pl-12 pr-4 py-3 bg-white border placeholder-gray-500 text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
        </div>

         <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías Destacadas</h2>
        {categorias.length === 0 ? (
          <p className="text-gray-500">No hay categorías disponibles.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.slice(0, 4).map((categoria: Category) => (
              <div key={categoria.id} className="group cursor-pointer">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-square rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow overflow-hidden">
                  <Image
                    src={imagenCategoria(categoria.image_url)}
                    alt={categoria.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                    unoptimized
                    priority
                  />
                </div>
                <h2 className="text-center text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                  {categoria.name}
                </h2>
                <h3 className="text-center text-sm font-normal text-gray-500 mt-1">
                  {categoria.description}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>
        {/* 🔹 Estado de carga / error */}
        {loading && (
          <p className="text-center text-gray-500 text-lg font-medium">Cargando productos...</p>
        )}
        {error && (
          <p className="text-center text-red-500 text-lg font-medium">{error}</p>
        )}

        {/* 🔹 Mostrar productos */}
        {!loading && !error && productos.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Productos disponibles</h2>
            </div>

            <div className="relative group">
              {/* Carrusel */}
              <div
                ref={carouselRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        
              >
                {[...productos, ...productos].map((p: Product, index: number) => {
                  const primary = p.images?.find((img: ProductImage) => img.is_primary)?.url;
                  const src = p.main_image_url || (primary ? `http://127.0.0.1:8000${primary}` : '/placeholder.png');

                  return (
                    <div
                      key={`${p.id}-${index}`}
                      className="flex-none w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                    >
                      <div className="aspect-square relative bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden rounded-t-xl">
                       
                        <Image
                          src={src}
                          alt={p.name}
                          fill
                          unoptimized
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-700 mb-1 truncate">{p.name}</h3>
                        <p className="text-xl text-gray-900">$ {p.price}</p>
                      </div>
                    
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        )}

        {/* Si no hay productos */}
        {!loading && !error && productos.length === 0 && (
          <p className="text-center text-gray-500 text-lg font-medium">
            No hay productos disponibles.
          </p>
        )}
      </main>
    </div>
  );
}
