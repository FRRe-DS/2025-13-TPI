'use client';

import { buildRegisterUrl } from '../../../lib/keycloak';

export default function RegisterPage() {
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildRegisterUrl();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Crear cuenta
          </h2>
          <p className="text-gray-600 mt-2">
            Serás redirigido al formulario oficial de registro de Keycloak.
            Una vez creada tu cuenta, volverás automáticamente al portal de compras.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 
                       text-white py-2 rounded-md font-medium 
                       shadow transition"
          >
            Registrarse con Keycloak
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
