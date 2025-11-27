export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded"></div>
          <span className="text-lg font-semibold text-gray-900">Brand</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Skeleton */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Right Column - Details Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            <div className="h-12 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando Producto...</p>
          </div>
        </div>
      </main>
    </div>
  );
}