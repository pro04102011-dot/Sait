"use client";

import { useState } from "react";
import { business } from "@/lib/data";
import { useCart } from "./Cart";
import Pizza from "./Pizza";

const links = [
  { href: "#menu", label: "Меню" },
  { href: "#delivery", label: "Доставка" },
  { href: "#about", label: "Про нас" },
  { href: "#contacts", label: "Контакти" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const cart = useCart();

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="logo">
          <Pizza toppings={["pepperoni", "basil"]} count={7} className="logo__pizza" />
          {business.name}
        </a>

        <nav className={`nav ${open ? "nav--open" : ""}`} onClick={() => setOpen(false)}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a href={business.phoneHref} className="nav__phone">{business.phone}</a>
        </nav>

        <div className="header__actions">
          <button
            className="cart-btn"
            onClick={() => cart.setOpen(true)}
            aria-label={`Кошик, товарів: ${cart.count}`}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20.5" r="1.5" fill="currentColor" />
              <circle cx="17" cy="20.5" r="1.5" fill="currentColor" />
            </svg>
            {/* key змінюється при додаванні — бейдж «підстрибує» */}
            {cart.count > 0 && <span key={cart.lastAdded} className="cart-btn__count">{cart.count}</span>}
            <span className="cart-btn__sum">{cart.total > 0 ? `${cart.total} ₴` : "Кошик"}</span>
          </button>
          <button className="burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
