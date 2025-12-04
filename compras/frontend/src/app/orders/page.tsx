'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';

interface OrderListItem {
  id: number;
  status: string;
  total_amount: string | number;
  created_at: string;
  shipping_status?: string | null;
  shipping_transport_type?: string | null;
}

export default function OrdersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/api/orders/my', {}, token);
        setOrders((data as OrderListItem[]) || []);
      } catch (err: unknown) {
        console.error(err);
        let message = 'Error al cargar tus pedidos.';
        if (err instanceof Error && err.message) {
          message = err.message;
        } else if (typeof err === 'object' && err && 'message' in err) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          message = String((err as any).message) || message;
        }
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const formatMoney = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(num)) return value;
    return num.toFixed(2);
  };

  const formatOrderStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PAID':
        return 'Pagada';
      case 'CANCELED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatShippingStatus = (status?: string | null) => {
    if (!status) return 'Sin envío';
    switch (status) {
      case 'created':
        return 'Creado';
      case 'reserved':
        return 'Reservado';
      case 'in_transit':
        return 'En tránsito';
      case 'arrived':
        return 'Llegó a sucursal';
      case 'in_distribution':
        return 'En distribución';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Envío cancelado';
      default:
        return status;
    }
  };

  const formatTransportType = (t?: string | null) => {
    if (!t) return '-';
    switch (t) {
      case 'air':
        return 'Aéreo';
      case 'road':
        return 'Terrestre';
      case 'rail':
        return 'Tren';
      case 'sea':
        return 'Marítimo';
      default:
        return t;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-md mx-4">
          <h1 className="text-xl font-semibold mb-2">Mis pedidos</h1>
          <p className="text-gray-600 text-sm mb-4">
            Necesitás iniciar sesión para ver tu historial de pedidos.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:underline"
          >
            Volver a la tienda
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
            {errorMsg}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Todavía no tenés pedidos realizados.
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Ir a comprar
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Orden</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Envío (estado)</th>
                  <th className="px-4 py-3 text-left">Envío (tipo)</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">#{order.id}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {formatOrderStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatShippingStatus(order.shipping_status)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatTransportType(order.shipping_transport_type)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ${formatMoney(order.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
