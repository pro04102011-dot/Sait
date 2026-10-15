"use client";

import { business } from "@/lib/data";
import { useCart } from "./Cart";

export default function Header() {
  const cart = useCart();

  return (
    <header className="topbar">
      <a href="#top" className="topbar__logo">{business.name.toUpperCase()}</a>
      <nav className="topbar__nav">
        <a href="#menu">Меню</a>
        <a href="#build">Збери свою</a>
        <a href="#extras">Закуски</a>
        <a href="#contacts">Контакти</a>
      </nav>
      <button className="topbar__cart" onClick={() => cart.setOpen(true)} aria-label={`Кошик, товарів: ${cart.count}`}>
        <span className="topbar__cart-label">Кошик</span>
        {/* key змінюється при додаванні — лічильник «підстрибує» */}
        <span key={cart.lastAdded} className={`topbar__count ${cart.count ? "topbar__count--on" : ""}`}>{cart.count}</span>
        {cart.total > 0 && <span className="topbar__sum">{cart.total} ₴</span>}
      </button>
    </header>
  );
}
