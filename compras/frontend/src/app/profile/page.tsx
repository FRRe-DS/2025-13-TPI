'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('perfil');
  const router = useRouter();
  const userData = {
    name: 'Sofía Rodríguez',
    username: '@sofiarodriguez',
    email: 'sofia.rodriguez@ejemplo.com',
    sessionId: '#UX92847',
    gender: 'Femenino',
    birthdate: '15/03/1995'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex ">
          {/* Main Content */}
          <div className="flex-1 bg-white shadow-md rounded-lg mt-5 mb-5">
            {/* Header */}
            <div className="border-b border-gray-200 px-8 py-6">
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === 'perfil'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Perfil
                </button>
                <button
                    onClick={() => {
                        router.push('/orders');
                        setActiveTab('pedidos');
                    }}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                        activeTab === 'pedidos'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    >
                    Pedidos
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              {/* Profile Section */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                    <p className="text-sm text-gray-500">{userData.sessionId}</p>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones de Cuenta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Ver Órdenes
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Cambiar Contraseña
                  </button>
                  
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacion de Usuario</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="text-sm text-gray-500">{userData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}