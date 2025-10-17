'use client';
import { useState } from 'react';
import { Heart, ShoppingBag, ChevronRight, Truck, RefreshCcw, Shield, Star } from 'lucide-react';

export default function ProductoDetalle() {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const imagenes = [
    { emoji: '👗', color: 'bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200' },
    { emoji: '👗', color: 'bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200' },
    { emoji: '🎨', color: 'bg-gradient-to-br from-amber-50 via-orange-100 to-red-200' }
  ];

  return (
    <div className="min-h-screen bg-white">
 
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb Premium */}
        <nav className="flex items-center gap-2 text-sm mb-10">
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Tecnologia</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Mouse</span>
        </nav>

        <div className="grid sm:grid-cols-12 gap-16">
          {/* Galería de Imágenes - 7 columnas */}
          <div className="lg:col-span-7 space-y-6">
            {/* Imagen Principal */}
            <div className={`${imagenes[imagenSeleccionada].color} rounded-lg overflow-hidden aspect-[10/9] flex items-center justify-center shadow-sm border border-gray-200`}>
              <div className="text-9xl">{imagenes[imagenSeleccionada].emoji}</div>
            </div>

            {/* Miniaturas Premium */}
            <div className="grid grid-cols-5  gap-4 ">
              {imagenes.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImagenSeleccionada(index)}
                  className={`${img.color} aspect-[10/10] w-20 h-20 rounded-lg flex items-center justify-center text-5xl transition-all border-2 ${
                    imagenSeleccionada === index
                      ? 'border-gray-900 shadow-md'
                      : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                  }`}
                >
                  {img.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Información del Producto - 5 columnas */}
          <div className="lg:col-span-5 space-y-8">
            {/* Título y Descripción */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
                Elegant Evening Gown
              </h1>
              <p className="text-gray-600 leading-relaxed">
                A stunning evening gown, perfect for formal events. Features a flattering silhouette and luxurious fabric.
              </p>
            </div>

            {/* Precio */}
            <div className="py-6 border-y border-gray-200">
              <div className="text-3xl font-light text-gray-900">$249.99</div>
              <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Product Information Grid */}
            <div className="grid grid-cols-2 gap-4 py-6 border-b border-gray-200">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">SKU</div>
                <div className="text-sm font-medium text-gray-900">EVG-001</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Availability</div>
                <div className="text-sm font-medium text-green-600">In Stock</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</div>
                <div className="text-sm font-medium text-gray-900">Dresses</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Product ID</div>
                <div className="text-sm font-medium text-gray-900">12345</div>
              </div>
            </div>

            {/* Selector de cantidad */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border border-gray-300 rounded h-10 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botones de Acción Premium */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-900 text-white py-4 px-8 rounded hover:bg-gray-800 transition-all font-medium tracking-wide">
                  Add to Cart
                </button>
                <button
                  onClick={() => setFavorito(!favorito)}
                  className={`w-14 h-14 rounded border-2 transition-all flex items-center justify-center ${
                    favorito
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}