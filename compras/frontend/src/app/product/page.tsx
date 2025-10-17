'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  main_image_url?: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/product') // 🔹 Endpoint FastAPI
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error cargando productos:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-gray-500">Cargando productos...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" /> Productos disponibles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {product.main_image_url ? (
                  <img
                    src={product.main_image_url}
                    alt={product.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-6xl">🛍️</span>
                )}
              </div>
              <h2 className="text-lg font-medium text-gray-900">{product.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <div className="text-gray-900 font-semibold mt-2">${product.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
