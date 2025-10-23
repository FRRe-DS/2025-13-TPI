'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductImage {
  url?: string;
  is_primary?: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images?: ProductImage[];
}

export default function CatalogoAccesorios() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [ordenar, setOrdenar] = useState('destacado');
  const [precioDesde, setPrecioDesde] = useState('');
  const [precioHasta, setPrecioHasta] = useState('');
  const router = useRouter();

  const BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${BASE_URL}/api/product`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al obtener productos:', err));
  }, []);

  const categorias = Array.from(new Set(productos.map((p) => p.category))).filter(Boolean);

  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = categoriaSeleccionada ? p.category === categoriaSeleccionada : true;
    const desde = precioDesde ? parseFloat(precioDesde) : 0;
    const hasta = precioHasta ? parseFloat(precioHasta) : Infinity;
    return coincideCategoria && p.price >= desde && p.price <= hasta;
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
    const primary = producto.images?.find((img) => img.is_primary)?.url;
    const fallback = producto.images?.[0]?.url;
    const final = primary || fallback || '/placeholder.png';

    // normalizar URL (por si viene sin http)
    return final.startsWith('http') ? final : `${BASE_URL}${final}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <a href="dashboard" className="hover:text-gray-900">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Categorías</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 🔹 FILTRO IZQUIERDO */}
          <div className="lg:col-span-1 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">CATEGORÍAS</h1>
            <div className="space-y-2">
              {categorias.map((nombre, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/category/${encodeURIComponent(nombre)}`)}
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
              <p className="font-semibold mb-1 text-sm text-black">Filtrar por precio</p>
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
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm"
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
              <p className="text-gray-500 text-center">No hay productos disponibles.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosOrdenados.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <Image
                        src={imagenProducto(producto)} // 👈 función que busca la imagen relacionada
                        alt={producto.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{producto.name}</h3>
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
