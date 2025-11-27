"use client";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";   // 👈 esta import
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 👇 en qué rutas NO quiero mostrar la navbar
  const hideNavbar = pathname === "/login";      // sin barra final

  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {/* Solo muestro la navbar si NO estoy en /login */}
          {!hideNavbar && <Navbar />}

          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
