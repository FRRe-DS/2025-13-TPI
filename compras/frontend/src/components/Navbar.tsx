'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { buildImageUrl } from '@/utils/imageUrl'; // ⬅️ igual que en category

// ========= Tipos usados en el NAVBAR =========

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

// ========= Tipos del BACK DE STOCK (8001/v1) =========

interface BackendCategoria {
  id: number;
  nombre: string;
  descripcion: string;
}

interface BackendImage {
  id: number;
  url: string;
  esPrincipal: boolean;
  productoId: number;
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const cartMenuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Base de la API → STOCK
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const API_URL =
    rawApiUrl && rawApiUrl.trim() !== ''
      ? rawApiUrl
      : 'http://localhost:8001/v1';

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar productos una sola vez para autocompletado
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/productos`);
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
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

        setAllProducts(mapped);
      } catch (err) {
        console.error('Error al obtener productos para el navbar:', err);
      }
    };

    fetchProductos();
  }, [API_URL]);

  // 🔹 función auxiliar para mostrar la imagen en el autocomplete
  const imagenProductoNavbar = (producto: Product) => {
    const primary = producto.images?.find((img) => img.is_primary);
    const candidate = primary ?? producto.images?.[0];

    if (!candidate?.url) {
      return '/placeholder.png'; // mismo fallback que en category
    }

    return buildImageUrl(candidate.url);
  };

  // Autocompletado
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const query = value.trim().toLowerCase();

    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const filtered = allProducts
      .filter((p) => {
        const nombre = p.name.toLowerCase();
        const categoria = p.category.toLowerCase();
        return nombre.includes(query) || categoria.includes(query);
      })
      .slice(0, 8); // máximo 8 sugerencias

    setSearchResults(filtered);
  };

  const goToSearchPage = () => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/category?search=${encodeURIComponent(q)}`);
    setIsSearching(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      goToSearchPage();
    }
  };

  const cartItems = [
    { id: 1, name: 'Producto en carrito 1', price: '$99.99', quantity: 2, image: '/placeholder.jpg' },
    { id: 2, name: 'Producto en carrito 2', price: '$149.99', quantity: 1, image: '/placeholder.jpg' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image
              src="/1.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-24 h-24"
            />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery && setIsSearching(true)}
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-4 py-2 text-gray-700 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={goToSearchPage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Dropdown de autocompletado */}
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            router.push(`/product/${product.id}`);
                            setIsSearching(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                        >
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                            <Image
                              src={imagenProductoNavbar(product)}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category}
                            </p>
                            <p className="text-sm text-gray-700">
                              ${product.price.toLocaleString('es-ES')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2 px-4 pb-2">
                        <button
                          onClick={goToSearchPage}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Ver todos los resultados para &quot;{searchQuery}&quot;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      <p className="text-sm">No se encontraron productos</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <div className="relative" ref={cartMenuRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Carrito de compras</h3>
                  </div>

                  {cartItems.length > 0 ? (
                    <>
                      <div className="max-h-96 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50"
                          >
                            <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">{item.price}</p>
                              <p className="text-xs text-gray-500">
                                Cantidad: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-900">$249.98</span>
                        </div>
                        <button
                          onClick={() => router.push('/cart')}
                          className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
                        >
                          Ver carrito completo
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <p className="text-sm">Tu carrito está vacío</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Icon */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-700 flex items-center justify-center transition shadow-sm"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Mi cuenta</p>
                    <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
                  </div>

                  <button
                    onClick={() => {
                      router.push('/profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Mi perfil
                  </button>

                  <button
                    onClick={() => {
                      router.push('/orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Mis pedidos
                  </button>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        console.log('Cerrar sesión');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Buscar productos, marcas y más..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={goToSearchPage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Autocompletado también en mobile */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          router.push(`/product/${product.id}`);
                          setIsSearching(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={imagenProductoNavbar(product)}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category}
                          </p>
                          <p className="text-sm text-gray-700">
                            ${product.price.toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2 px-4 pb-2">
                      <button
                        onClick={goToSearchPage}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver todos los resultados para &quot;{searchQuery}&quot;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    <p className="text-sm">No se encontraron productos</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
