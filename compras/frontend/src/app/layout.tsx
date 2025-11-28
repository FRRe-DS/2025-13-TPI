"use client";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";   
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

 
  const hideNavbar = pathname === "/login";      

  return (
    <html lang="es">
      <body>
        <AuthProvider>
         
          {!hideNavbar && <Navbar />}

          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
