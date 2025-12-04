'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CartView() {
  const router = useRouter();

  const { items: cartItems, subtotal, updateQuantity, removeFromCart } = useCart();

  const shipping = 5.99;
  const total = subtotal + shipping;

  // 👇 Estado local para la dirección de entrega
  const [address, setAddress] = useState({
    alias: 'Casa',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
  });

  // Handler genérico para inputs
  const handleAddressChange = (
    field: keyof typeof address,
    value: string
  ) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Resumen de pedido
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 mb-4">
              Tu carrito está vacío.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 transition"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Productos</h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">
                            Cantidad:
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                Math.max(1, parseInt(e.target.value || '1', 10))
                              )
                            }
                            className="w-16 text-sm text-center border border-gray-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dirección de entrega (formulario) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Dirección de entrega
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-5 h-5 text-blue-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <div className="w-full space-y-4">
                  {/* Alias de la dirección (Casa, Trabajo, etc.) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la dirección
                    </label>
                    <input
                      type="text"
                      value={address.alias}
                      onChange={(e) =>
                        handleAddressChange('alias', e.target.value)
                      }
                      placeholder="Ej.: Casa, Trabajo…"
                      className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Calle y número */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calle y número
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        handleAddressChange('street', e.target.value)
                      }
                      placeholder="Calle Principal 123"
                      className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Ciudad / Provincia / Código postal */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          handleAddressChange('city', e.target.value)
                        }
                        placeholder="Ciudad"
                        className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia
                      </label>
                      <input
                        type="text"
                        value={address.province}
                        onChange={(e) =>
                          handleAddressChange('province', e.target.value)
                        }
                        placeholder="Provincia"
                        className="w-full border border-gray-300 text-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código postal
                      </label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) =>
                          handleAddressChange('postalCode', e.target.value)
                        }
                        placeholder="CP"
                        className="w-full border border-gray-300 rounded-lg text-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* País */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) =>
                        handleAddressChange('country', e.target.value)
                      }
                      placeholder="País"
                      className="w-full border border-gray-300 text-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vista rápida (opcional) */}
              <p className="text-xs text-gray-500 mt-2">
                Esta será la dirección utilizada para el envío de tu pedido.
              </p>
            </div>

            {/* Resumen de costos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Resumen de costos
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío estándar</span>
                  <span className="text-gray-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full mt-6 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition">
                Confirmar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
