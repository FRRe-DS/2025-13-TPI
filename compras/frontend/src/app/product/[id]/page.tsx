'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error('Error al cargar producto:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-gray-500">Cargando producto...</div>;
  if (!product) return <div className="p-10 text-gray-500">Producto no encontrado</div>;

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.main_image_url || ''];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <a href="/product" className="text-gray-500 hover:text-gray-900">Productos</a>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Imagen principal */}
        <div className="space-y-4">
          <div className="aspect-square border rounded-lg flex items-center justify-center overflow-hidden">
            {images[imageIndex] ? (
              <img src={images[imageIndex]} alt={product.name} className="object-contain w-full h-full" />
            ) : (
              <span className="text-8xl">🖼️</span>
            )}
          </div>

          {/* Miniaturas */}
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                  imageIndex === i
                    ? 'border-gray-900 shadow-md'
                    : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                }`}
              >
                <img src={img} alt="" className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Detalle del producto */}
        <div className="space-y-6">
          <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <div className="text-3xl font-semibold text-gray-900">${product.price}</div>

          <div className="text-sm text-gray-500">
            <p>SKU: {product.sku}</p>
            <p>Categoría: {product.category}</p>
            <p>Stock: {product.stock > 0 ? 'Disponible' : 'Agotado'}</p>
          </div>

          <button className="bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
