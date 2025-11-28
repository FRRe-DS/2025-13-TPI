'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartView() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Camiseta de algodón orgánico',
      quantity: 2,
      price: 40.00,
      image: '/placeholder.jpg'
    },
    {
      id: 2,
      name: 'Pantalones deportivos',
      quantity: 1,
      price: 50.00,
      image: '/placeholder.jpg'
    },
    {
      id: 3,
      name: 'Zapatillas de running',
      quantity: 1,
      price: 30.00,
      image: '/placeholder.jpg'
    }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Resumen de pedido</h1>

        <div className="space-y-8">
          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Productos</h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Dirección de entrega</h2>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Casa</p>
                <p className="text-sm text-gray-600">Calle Principal 123, Ciudad, País</p>
              </div>
              <button className="ml-auto text-blue-500 hover:text-blue-600 text-sm font-medium">
                Cambiar
              </button>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen de costos</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío estándar</span>
                <span className="text-gray-900">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition">
              Confirmar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}