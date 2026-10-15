"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { lineKey, linePrice, type CartLine } from "@/lib/data";

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">) => void;
  change: (key: string, delta: number) => void;
  clear: () => void;
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  lastAdded: number; // мітка часу — для анімації кнопки кошика
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "pichka-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // кошик переживає перезавантаження; читаємо після гідратації,
  // інакше серверний і клієнтський HTML розійдуться
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setLines(saved.filter((l) => linePrice(l) !== undefined && l.qty > 0));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
  }, [lines, loaded]);

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", open);
  }, [open]);

  const value = useMemo<CartState>(() => ({
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    total: lines.reduce((s, l) => s + (linePrice(l) ?? 0) * l.qty, 0),
    open,
    setOpen,
    lastAdded,
    add: (line) => {
      const key = lineKey(line);
      setLines((ls) =>
        ls.some((l) => lineKey(l) === key)
          ? ls.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(l.qty + 1, 50) } : l))
          : [...ls, { ...line, qty: 1 }]
      );
      setLastAdded(Date.now());
    },
    change: (key, delta) =>
      setLines((ls) =>
        ls.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(l.qty + delta, 50) } : l)).filter((l) => l.qty > 0)
      ),
    clear: () => setLines([]),
  }), [lines, open, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
