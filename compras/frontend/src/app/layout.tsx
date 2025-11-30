import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import AppShell from './AppShell'; // 👈 nuevo componente cliente

export const metadata: Metadata = {
  title: 'Portal de Compras',
  description: 'TPI Compras',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
