import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

// Evitamos que Next intente prerenderizar esto como estático
export const dynamic = 'force-dynamic';

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Completando inicio de sesión...</p>
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
