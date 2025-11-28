'use client';
import { useState } from 'react';

export default function OrdersView() {
  const orders = [
    {
      id: 1,
      orderNumber: '123456',
      status: 'En Tránsito',
      statusColor: 'bg-blue-500',
      progress: 60,
      pedidoId: '#93456',
      date: '15 de julio de 2024',
      address: 'Calle Principal 123, Ciudad',
      icon: '📦'
    },
    {
      id: 2,
      orderNumber: '789012',
      status: 'Entregado',
      statusColor: 'bg-green-500',
      progress: 100,
      pedidoId: '#789012',
      date: '20 de junio de 2024',
      address: 'Calle Principal 123, Ciudad',
      icon: '📦'
    },
    {
      id: 3,
      orderNumber: '345678',
      status: 'Pendiente',
      statusColor: 'bg-yellow-500',
      progress: 20,
      pedidoId: '#345678',
      date: '5 de junio de 2024',
      address: 'Calle Principal 123, Ciudad',
      icon: '📦'
    }
  ];

  const getStatusLabel = (status) => {
    const labels = {
      'En Tránsito': { text: 'En camino', color: 'text-blue-600' },
      'Entregado': { text: 'Completado', color: 'text-green-600' },
      'Pendiente': { text: 'Preparando', color: 'text-yellow-600' }
    };
    return labels[status] || { text: status, color: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Mis Pedidos</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusLabel(order.status);
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.status}</h3>
                        <p className="text-sm text-gray-500">Pedido {order.pedidoId} • {order.date}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">{order.status === 'Entregado' ? 'Entregado' : order.status}</span>
                      <span className={statusInfo.color}>{statusInfo.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${order.statusColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Detalles del Pedido</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Número de Pedido</p>
                      <p className="text-gray-900 font-medium">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Fecha del Pedido</p>
                      <p className="text-gray-900 font-medium">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Dirección de Envío</p>
                      <p className="text-gray-900 font-medium">{order.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}