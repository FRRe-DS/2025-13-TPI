'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '../../../lib/api';

interface TransportMethod {
  type: 'air' | 'road' | 'rail' | 'sea';
  name: string;
  estimated_days: string;
}

interface AddressForm {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const cartItems = items as CartItem[];

  const { token } = useAuth();

  const [transportMethods, setTransportMethods] = useState<TransportMethod[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<string>('road');
  const [address, setAddress] = useState<AddressForm>({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'AR',
  });
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Cargar métodos de transporte
  useEffect(() => {
    if (!token) return;

    const loadMethods = async () => {
      try {
        const data = await apiFetch('/api/shipping/transport-methods', {}, token);
        setTransportMethods(data.transport_methods || []);
        if ((data.transport_methods || []).length > 0) {
          setSelectedTransport(data.transport_methods[0].type);
        }
      } catch (err: unknown) {
        console.error('Error cargando métodos de transporte', err);
      }
    };

    loadMethods();
  }, [token]);

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.postal_code ||
      !address.country
    ) {
      setErrorMsg('Completá todos los campos de dirección para calcular el envío.');
      return false;
    }
    return true;
  };

  const handleCalculateShipping = async () => {
    if (!token) {
      setErrorMsg('Debes iniciar sesión para calcular el envío.');
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg('Tu carrito está vacío.');
      return;
    }
    if (!validateAddress()) return;

    setIsCalculatingShipping(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const body = {
        delivery_address: address,
        products: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const data = await apiFetch(
        '/api/shipping/cost',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        token
      );

      setShippingCost(data.total_cost ?? 0);
      setSuccessMsg('Costo de envío calculado correctamente.');
    } catch (err: unknown) {
      console.error(err);
      let message = 'No se pudo calcular el costo de envío.';
      if (err instanceof Error && err.message) {
        message = err.message;
      } else if (typeof err === 'object' && err && 'message' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message = String((err as any).message) || message;
      }
      setErrorMsg(message);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCheckout = async () => {
    if (!token) {
      setErrorMsg('Debes iniciar sesión para confirmar la compra.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg('Tu carrito está vacío.');
      return;
    }

    if (!validateAddress()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const body = {
        delivery_address: address,
        transport_type: selectedTransport,
      };

      const order = await apiFetch(
        '/api/cart/checkout',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        token
      );

      if (clearCart) clearCart();
      setSuccessMsg(`Compra confirmada. Orden #${order.id}`);
      router.push('/orders');
    } catch (err: unknown) {
      console.error(err);
      let message = 'Error al confirmar la compra.';
      if (err instanceof Error && err.message) {
        message = err.message;
      } else if (typeof err === 'object' && err && 'message' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message = String((err as any).message) || message;
      }
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = subtotal + (shippingCost ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-[2fr,1.2fr]">
        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrito de compras</h1>

          {/* Items del carrito */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Tu carrito está vacío.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Precio unitario: ${item.price.toFixed(2)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm text-gray-600">Cantidad:</span>
                        <button
                          className="px-2 py-1 border rounded text-sm"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          className="px-2 py-1 border rounded text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="ml-4 text-sm text-red-500 hover:underline"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dirección de entrega */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Dirección de entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calle y número
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Av. Siempre Viva 123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Resistencia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="Chaco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código postal
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={address.postal_code}
                  onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                  placeholder="H3500ABC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  placeholder="AR"
                />
              </div>
            </div>
          </div>

          {/* Métodos de transporte */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Método de envío
            </h2>
            {transportMethods.length === 0 ? (
              <p className="text-sm text-gray-500">
                No se pudieron cargar los métodos de transporte o no hay ninguno disponible.
              </p>
            ) : (
              <div className="space-y-2">
                {transportMethods.map((method) => (
                  <label
                    key={method.type}
                    className="flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="transport_type"
                        value={method.type}
                        checked={selectedTransport === method.type}
                        onChange={() => setSelectedTransport(method.type)}
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500">
                          Tipo: {method.type} • {method.estimated_days} días aprox.
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: mensajes + resumen */}
        <div className="space-y-4">
          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal productos</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Envío</span>
              <span>
                {shippingCost != null ? `$${shippingCost.toFixed(2)}` : 'Calculá el envío'}
              </span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium"
              type="button"
              onClick={handleCalculateShipping}
              disabled={isCalculatingShipping || cartItems.length === 0}
            >
              {isCalculatingShipping ? 'Calculando envío...' : 'Calcular costo de envío'}
            </button>

            <button
              className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 transition"
              type="button"
              onClick={handleCheckout}
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? 'Procesando compra...' : 'Confirmar compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

