"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { menu, priceOf, type Size } from "@/lib/data";

export type CartLine = { id: string; size?: Size; qty: number };

type CartState = {
  lines: CartLine[];
  add: (id: string, size?: Size) => void;
  change: (id: string, size: Size | undefined, delta: number) => void;
  clear: () => void;
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  lastAdded: number; // мітка часу — для анімації кнопки кошика
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "pichka-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // кошик переживає перезавантаження сторінки; читаємо після гідратації,
  // інакше серверний і клієнтський HTML розійдуться
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setLines(saved.filter((l) => menu.some((m) => m.id === l.id)));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
  }, [lines, loaded]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const value = useMemo<CartState>(() => {
    const same = (l: CartLine, id: string, size?: Size) => l.id === id && l.size === size;
    const total = lines.reduce((s, l) => {
      const item = menu.find((m) => m.id === l.id);
      return s + (item ? (priceOf(item, l.size) ?? 0) * l.qty : 0);
    }, 0);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total,
      open,
      setOpen,
      lastAdded,
      add: (id, size) => {
        setLines((ls) =>
          ls.some((l) => same(l, id, size))
            ? ls.map((l) => (same(l, id, size) ? { ...l, qty: Math.min(l.qty + 1, 50) } : l))
            : [...ls, { id, size, qty: 1 }]
        );
        setLastAdded(Date.now());
      },
      change: (id, size, delta) =>
        setLines((ls) =>
          ls.map((l) => (same(l, id, size) ? { ...l, qty: Math.min(l.qty + delta, 50) } : l)).filter((l) => l.qty > 0)
        ),
      clear: () => setLines([]),
    };
  }, [lines, open, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
