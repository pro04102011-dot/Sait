"use client";

import { useEffect, useState } from "react";
import { business, delivery, lineKey, lineName, linePrice, toppingInfo } from "@/lib/data";
import { useCart } from "./Cart";

type Status = "idle" | "sending" | "ok" | "error";

// Кошик у вигляді касового чека, що «друкується» збоку
export default function CartDrawer() {
  const cart = useCart();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [pastHero, setPastHero] = useState(false);

  // плаваюча кнопка кошика з'являється лише після сцени з піччю, щоб не закривати її
  useEffect(() => {
    const check = () => {
      const oven = document.querySelector<HTMLElement>(".oven");
      setPastHero(!oven || window.scrollY > oven.offsetHeight - window.innerHeight * 0.6);
    };
    const first = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", check);
    };
  }, []);

  const fee = mode === "delivery" && cart.total > 0 && cart.total < delivery.freeFrom ? delivery.price : 0;
  const { open, setOpen } = cart;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

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
    setOpen(false);
    if (status === "ok") setStatus("idle");
  };

  return (
    <>
      {cart.count > 0 && !open && pastHero && (
        <button className="cart-float" onClick={() => setOpen(true)}>
          <span>Кошик · {cart.count}</span>
          <strong>{cart.total} ₴</strong>
        </button>
      )}

      <div className={`shade ${open ? "is-open" : ""}`} onClick={close} />
      <aside className={`slip ${open ? "is-open" : ""}`} aria-hidden={!open} aria-label="Кошик" inert={!open}>
        <button className="slip__close" onClick={close} aria-label="Закрити">✕</button>
        <div className="slip__paper">
          <div className="slip__head">
            <strong>{business.name.toUpperCase()}</strong>
            <span>ваше замовлення</span>
          </div>

          {status === "ok" ? (
            <div className="slip__state">
              <p className="slip__big">ПРИЙНЯТО ✓</p>
              <p>Зателефонуємо за кілька хвилин, щоб підтвердити. Піч уже гріється.</p>
              <button className="btn btn--fire" onClick={close}>Супер</button>
            </div>
          ) : cart.lines.length === 0 ? (
            <div className="slip__state">
              <p className="slip__big">ПОКИ ПОРОЖНЬО</p>
              <p>Оберіть піцу в меню або зберіть свою.</p>
              <a href="#menu" className="btn btn--fire" onClick={close}>До меню</a>
            </div>
          ) : (
            <>
              <ul className="slip__lines">
                {cart.lines.map((l) => {
                  const key = lineKey(l);
                  const price = linePrice(l) ?? 0;
                  return (
                    <li key={key}>
                      <div className="slip__line">
                        <span className="slip__name">
                          {lineName(l)}{l.size && ` ${l.size} см`}
                          {l.toppings && <small>{l.toppings.map((t) => toppingInfo[t].label.toLowerCase()).join(", ")}</small>}
                        </span>
                        <span className="slip__dots" />
                        <span>{price * l.qty} ₴</span>
                      </div>
                      <div className="slip__qty">
                        <button onClick={() => cart.change(key, -1)} aria-label="Менше">−</button>
                        <span>{l.qty} × {price} ₴</span>
                        <button onClick={() => cart.change(key, 1)} aria-label="Більше">+</button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="slip__sum">
                <div><span>Сума</span><span>{cart.total} ₴</span></div>
                {mode === "delivery" && <div><span>Доставка</span><span>{fee ? `${fee} ₴` : "0 ₴"}</span></div>}
                {mode === "delivery" && fee > 0 && <p>ще {delivery.freeFrom - cart.total} ₴ — і доставка безкоштовна</p>}
                <div className="slip__all"><span>РАЗОМ</span><span>{cart.total + fee} ₴</span></div>
              </div>

              <form className="slip__form" onSubmit={submit}>
                <div className="seg seg--slip" role="radiogroup" aria-label="Спосіб отримання">
                  <button type="button" role="radio" aria-checked={mode === "delivery"} className={mode === "delivery" ? "is-on" : ""} onClick={() => setMode("delivery")}>Доставка</button>
                  <button type="button" role="radio" aria-checked={mode === "pickup"} className={mode === "pickup" ? "is-on" : ""} onClick={() => setMode("pickup")}>Самовивіз</button>
                </div>
                <input name="name" required maxLength={60} autoComplete="name" placeholder="Ім'я" aria-label="Ім'я" />
                <input name="phone" type="tel" required autoComplete="tel" placeholder="Телефон" aria-label="Телефон" pattern="[\d\s+()\-]{10,20}" />
                {mode === "delivery" ? (
                  <input name="address" required maxLength={160} autoComplete="street-address" placeholder="Адреса: вулиця, будинок, квартира" aria-label="Адреса" />
                ) : (
                  <p className="slip__note">Забрати: {business.address}</p>
                )}
                <textarea name="comment" rows={2} maxLength={300} placeholder="Коментар (без цибулі, решта з 1000…)" aria-label="Коментар" />
                <button className="btn btn--fire btn--wide" disabled={status === "sending"}>
                  {status === "sending" ? "Надсилаємо…" : `Замовити · ${cart.total + fee} ₴`}
                </button>
                {status === "error" && <p className="slip__err">{error}</p>}
              </form>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
