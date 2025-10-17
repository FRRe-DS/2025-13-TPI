"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, ChevronLeft, ChevronRight } from "lucide-react";

export default function TiendaEnLinea() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          throw new Error("Token inválido o sesión expirada. Inicia sesión nuevamente.");
        }
        if (!res.ok) throw new Error("Error al cargar productos.");

        const data = await res.json();
        setProductos(data);
      } catch (err: any) {
        console.error("Error al cargar productos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || isPaused) return;

    const autoScroll = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 20);

    return () => clearInterval(autoScroll);
  }, [isPaused]);

  const scroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  
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

      {/* Buscador */}
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
              {/* Botón Izquierdo */}
              <button
                onClick={() => {
                  setIsPaused(true);
                  scroll("left");
                  setTimeout(() => setIsPaused(false), 2000);
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 hover:text-gray-900 opacity-0 group-hover:opacity-100 hover:scale-110 -translate-x-1/2"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Carrusel */}
              <div
                ref={carouselRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {productos.map((p) => (
                  <div
                    key={p.id}
                    className="flex-none w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                  >
                    <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      <span className="text-6xl">🛍️</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">{p.name}</h3>
                      <p className="text-sm text-gray-600">Precio: ${p.price}</p>
                      <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón Derecho */}
              <button
                onClick={() => {
                  setIsPaused(true);
                  scroll("right");
                  setTimeout(() => setIsPaused(false), 2000);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 hover:text-gray-900 opacity-0 group-hover:opacity-100 hover:scale-110 translate-x-1/2"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
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
