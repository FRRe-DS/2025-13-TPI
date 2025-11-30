'use client';

import { buildRegisterUrl } from '../../../lib/keycloak';

export default function RegisterPage() {
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildRegisterUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h1>
        <p className="text-gray-600 mb-6 text-center">
          Serás redirigido al formulario de registro de Keycloak. Luego, podrás volver y usar el portal de compras.
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Registrarse con Keycloak
          </button>
        </form>
      </div>
    </div>
  );
}
