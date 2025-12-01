export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-24">
        <div className="text-center space-y-6">
          {/* Robot Triste */}
          <div className="flex justify-center">
            <svg 
              className="w-32 h-32" 
              viewBox="0 0 120 120" 
              fill="none"
            >
              {/* Antena */}
              <line x1="60" y1="15" x2="60" y2="25" stroke="#6B7280" strokeWidth="2"/>
              <circle cx="60" cy="12" r="3" fill="#6B7280"/>
              
              {/* Cabeza del robot */}
              <rect x="35" y="25" width="50" height="45" rx="8" fill="#3B82F6"/>
              <rect x="35" y="25" width="50" height="45" rx="8" fill="#60A5FA" opacity="0.5"/>
              
              {/* Ojos tristes */}
              <circle cx="48" cy="45" r="4" fill="#1F2937"/>
              <circle cx="72" cy="45" r="4" fill="#1F2937"/>
              <path d="M 44 48 Q 48 52 52 48" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M 68 48 Q 72 52 76 48" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              {/* Boca triste */}
              <path d="M 48 58 Q 60 54 72 58" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round"/>
              
              {/* Cuerpo */}
              <rect x="40" y="75" width="40" height="30" rx="6" fill="#3B82F6"/>
              <rect x="40" y="75" width="40" height="30" rx="6" fill="#60A5FA" opacity="0.5"/>
              
              {/* Detalles del cuerpo */}
              <circle cx="52" cy="87" r="3" fill="#1F2937" opacity="0.3"/>
              <circle cx="68" cy="87" r="3" fill="#1F2937" opacity="0.3"/>
              <rect x="56" y="93" width="8" height="8" rx="1" fill="#1F2937" opacity="0.3"/>
              
              {/* Brazos */}
              <rect x="25" y="78" width="12" height="20" rx="4" fill="#3B82F6"/>
              <rect x="83" y="78" width="12" height="20" rx="4" fill="#3B82F6"/>
              
              {/* Piernas */}
              <rect x="45" y="105" width="10" height="15" rx="3" fill="#3B82F6"/>
              <rect x="65" y="105" width="10" height="15" rx="3" fill="#3B82F6"/>
              
              {/* Lágrima */}
              <ellipse cx="75" cy="52" rx="2" ry="4" fill="#60A5FA" opacity="0.7"/>
            </svg>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Producto no encontrado
            </h1>
            <p className="text-gray-600">
              Lo sentimos, el producto que buscas no existe o ha sido eliminado.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Volver atrás
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}