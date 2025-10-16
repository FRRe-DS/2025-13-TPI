"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Panel de Control
          </h1>
          <p className="text-gray-600 mb-6">Bienvenido, {user?.email}!</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 text-sm text-gray-500">
        Usuario autenticado: {user?.email}
      </div>
      <div className="fixed bottom-4 left-4 text-sm text-gray-500">
        Este es un ejemplo de página protegida.
      </div>
    </ProtectedRoute>
  );
}
