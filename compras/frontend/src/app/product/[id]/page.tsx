'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stock: number;
  main_image_url?: string;
  images?: string[];
}

interface ProductImage {
  url?: string;
  is_primary?: boolean;
}


export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Product | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto(data);
      })
      .catch((err) => console.error('Error al obtener el producto:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-gray-500">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="p-10 text-gray-500">Producto no encontrado.</div>;
  }

const BASE_URL = "http://127.0.0.1:8000";

const imagenes: ProductImage[] =
  producto.images && producto.images.length > 0
    ? producto.images.map((img) => ({
        ...img,
        url: img.url
          ? img.url.startsWith("http")
            ? img.url
            : `${BASE_URL}${img.url}`
          : "/placeholder.png",
      }))
    : [{ url: "/placeholder.png", is_primary: true }];

const imagenPrincipal =
  imagenes.find((img) => img.is_primary)?.url ||
  imagenes[0]?.url ||
  "/placeholder.png";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-sm mb-10">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/category" className="text-gray-500 hover:text-gray-900 transition-colors">
            {producto.category || 'Categoría'}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{producto.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16">
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
                // Detecta si 'img' es un string o un objeto { url: string }
                const rawUrl =
                  typeof img === 'string'
                    ? img
                    : typeof img?.url === 'string'
                    ? img.url
                    : '';

                // Si no hay URL válida, usa el placeholder
                const imageUrl =
                  rawUrl && rawUrl.trim() !== '' && rawUrl.toLowerCase() !== 'string'
                    ? rawUrl
                    : '/placeholder.png';

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

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
                {producto.name}
              </h1>
              <div className="text-3xl font-light text-gray-900">
                ${producto.price}
              </div>
            </div>
            <div className="py-6 border-y border-gray-200">
              <h1 className="text-lg font-medium text-gray-500 mb-2">Descripción</h1>
              <p className="text-black leading-relaxed">{producto.description}</p>
            </div>
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
                  }
                  ${producto.stock < 6 && producto.stock > 0 ? 'text-yellow-600' : ''}`}
                >
                  {producto.stock == 0 ? 'Agotado' : ''}
                  {producto.stock < 6 ? 'Ultimas Unidades' : 'En stock'}
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
              <div>
              </div>
            </div>

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
