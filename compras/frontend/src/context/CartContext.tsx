'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'tpi-compras-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // === Cargar desde localStorage al montar ===
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error leyendo carrito de localStorage', e);
    }
  }, []);

  // === Guardar en localStorage cuando cambie ===
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito en localStorage', e);
    }
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        // Si ya está en el carrito, sumamos cantidad
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook para usar en cualquier componente
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
}
