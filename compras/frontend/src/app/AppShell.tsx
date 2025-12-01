// app/AppShell.tsx
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login';

  return (
    <AuthProvider>
      <CartProvider>
        {!hideNavbar && <Navbar />}
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
