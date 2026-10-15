"use client";

import { useEffect, useState } from "react";
import { business, delivery, menu, priceOf, sizes } from "@/lib/data";
import { useCart } from "./Cart";
import Pizza from "./Pizza";
import FoodIcon from "./FoodIcon";

type Status = "idle" | "sending" | "ok" | "error";

export default function CartDrawer() {
  const cart = useCart();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const fee = mode === "delivery" && cart.total > 0 && cart.total < delivery.freeFrom ? delivery.price : 0;

  useEffect(() => {
    if (!cart.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          address: form.get("address"),
          comment: form.get("comment"),
          mode,
          items: cart.lines,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Не вдалося надіслати замовлення");
      setStatus("ok");
      cart.clear();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Помилка мережі");
    }
  }

  const close = () => {
    cart.setOpen(false);
    if (status === "ok") setStatus("idle");
  };

  return (
    <>
      {cart.count > 0 && !cart.open && (
        <button className="cart-float" onClick={() => cart.setOpen(true)}>
          🛒 Кошик · {cart.count} · <strong>{cart.total} ₴</strong>
        </button>
      )}

      <div className={`drawer-bg ${cart.open ? "drawer-bg--open" : ""}`} onClick={close} />
      <aside className={`drawer ${cart.open ? "drawer--open" : ""}`} aria-hidden={!cart.open} aria-label="Кошик">
        <div className="drawer__head">
          <h2>Ваше замовлення</h2>
          <button className="drawer__close" onClick={close} aria-label="Закрити">✕</button>
        </div>

        {status === "ok" ? (
          <div className="drawer__done">
            <div className="drawer__done-icon">🍕</div>
            <h3>Дякуємо! Замовлення прийнято</h3>
            <p>Ми зателефонуємо протягом кількох хвилин, щоб підтвердити замовлення.</p>
            <button className="btn" onClick={close}>Добре</button>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="drawer__empty">
            <Pizza toppings={["mozzarella"]} count={6} className="drawer__empty-pizza" />
            <p>Кошик поки порожній</p>
            <a href="#menu" className="btn" onClick={close}>До меню</a>
          </div>
        ) : (
          <div className="drawer__body">
            <ul className="lines">
              {cart.lines.map((l) => {
                const item = menu.find((m) => m.id === l.id);
                if (!item) return null;
                const price = priceOf(item, l.size) ?? 0;
                return (
                  <li key={`${l.id}-${l.size ?? ""}`} className="line">
                    <div className="line__pic">
                      {item.toppings ? <Pizza toppings={item.toppings} seed={item.id} count={10} /> : item.icon && <FoodIcon icon={item.icon} />}
                    </div>
                    <div className="line__info">
                      <strong>{item.name}</strong>
                      {l.size && <span>{sizes.find((s) => s.id === l.size)?.label}</span>}
                      <span className="line__price">{price * l.qty} ₴</span>
                    </div>
                    <div className="qty">
                      <button onClick={() => cart.change(l.id, l.size, -1)} aria-label="Менше">−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => cart.change(l.id, l.size, 1)} aria-label="Більше">+</button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <form className="checkout" onSubmit={submit}>
              <div className="switch" role="radiogroup" aria-label="Спосіб отримання">
                <button type="button" role="radio" aria-checked={mode === "delivery"} className={mode === "delivery" ? "switch--on" : ""} onClick={() => setMode("delivery")}>🛵 Доставка</button>
                <button type="button" role="radio" aria-checked={mode === "pickup"} className={mode === "pickup" ? "switch--on" : ""} onClick={() => setMode("pickup")}>🏠 Самовивіз</button>
              </div>
              <label>Ім&apos;я<input name="name" required maxLength={60} autoComplete="name" /></label>
              <label>Телефон<input name="phone" type="tel" required placeholder="+380" autoComplete="tel" pattern="[\d\s+()\-]{10,20}" /></label>
              {mode === "delivery" ? (
                <label>Адреса<input name="address" required maxLength={160} placeholder="Вулиця, будинок, під'їзд, квартира" autoComplete="street-address" /></label>
              ) : (
                <p className="checkout__note">Забрати можна за адресою: {business.address}</p>
              )}
              <label>Коментар<textarea name="comment" rows={2} maxLength={300} placeholder="Наприклад: без цибулі, решта з 1000" /></label>

              <div className="totals">
                <div><span>Сума</span><span>{cart.total} ₴</span></div>
                {mode === "delivery" && (
                  <div><span>Доставка</span><span>{fee ? `${fee} ₴` : "безкоштовно"}</span></div>
                )}
                {mode === "delivery" && fee > 0 && (
                  <p className="totals__hint">Ще {delivery.freeFrom - cart.total} ₴ — і доставка безкоштовна</p>
                )}
                <div className="totals__all"><span>До сплати</span><span>{cart.total + fee} ₴</span></div>
              </div>

              <button className="btn btn--wide" disabled={status === "sending"}>
                {status === "sending" ? "Надсилаємо…" : "Оформити замовлення"}
              </button>
              {status === "error" && <p className="msg msg--err">{error}</p>}
            </form>
          </div>
        )}
      </aside>
    </>
  );
}
