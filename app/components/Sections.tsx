"use client";

import { useState } from "react";
import { business, delivery, extras } from "@/lib/data";
import { useCart } from "./Cart";
import FoodIcon from "./FoodIcon";

export function Extras() {
  const cart = useCart();
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <section className="extras" id="extras">
      <div className="wrap">
        <h2 className="eyebrow">До піци</h2>
        <p className="extras__title">Закуски й напої</p>
      </div>
      <div className="extras__rail">
        {extras.map((e) => (
          <article key={e.id} className="extra">
            <FoodIcon icon={e.icon} className="extra__icon" />
            <h3>{e.name}</h3>
            <p>{e.note}</p>
            <button
              className={`extra__add ${flash === e.id ? "is-done" : ""}`}
              onClick={() => {
                cart.add({ id: e.id });
                setFlash(e.id);
                setTimeout(() => setFlash((f) => (f === e.id ? null : f)), 900);
              }}
              aria-label={`Додати «${e.name}» у кошик`}
            >
              <span>{e.price} ₴</span>
              <b>{flash === e.id ? "✓" : "+"}</b>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Barcode() {
  // декоративний штрихкод з детермінованими смужками
  const bars = Array.from({ length: 46 }, (_, i) => ((i * 7919) % 5) + 1);
  let x = 0;
  return (
    <svg viewBox="0 0 200 40" className="receipt__barcode" aria-hidden preserveAspectRatio="none">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="40" /> : null;
        x += w;
        return rect;
      })}
    </svg>
  );
}

export function Info() {
  const rows: [string, React.ReactNode][] = [
    ["Адреса", business.address],
    ["Телефон", <a key="t" href={business.phoneHref}>{business.phone}</a>],
    ["Працюємо", business.hours],
    ["Доставка", `${delivery.time}, ${delivery.price} ₴`],
    ["Безкоштовно", `від ${delivery.freeFrom} ₴`],
    ["Самовивіз", "завжди безкоштовно"],
  ];
  return (
    <section className="info" id="contacts">
      <div className="wrap info__grid">
        <div className="receipt">
          <div className="receipt__head">
            <strong>{business.name.toUpperCase()}</strong>
            <span>ПІЦЕРІЯ · КИЇВ</span>
            <span>ЧЕК № 000001</span>
          </div>
          <dl className="receipt__rows">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="receipt__total">
            <span>НАСТРІЙ</span>
            <span>100%</span>
          </div>
          <Barcode />
          <p className="receipt__thanks">дякуємо, що ви з нами!</p>
        </div>

        <div className="info__side">
          <h2 className="eyebrow eyebrow--dark">Де нас знайти</h2>
          <p className="info__title">Заходьте на скибочку</p>
          <div className="info__map">
            <iframe title={`${business.name} на карті`} src={business.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="info__actions">
            <a href={business.googleMaps} className="btn btn--fire" target="_blank" rel="noopener noreferrer">Маршрут у Google Maps</a>
            <a href={business.phoneHref} className="btn btn--line btn--line-dark">Зателефонувати</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__word" aria-hidden>{business.name}</p>
      <div className="wrap footer__row">
        <span>© {business.name} — піца з печі</span>
        <a href={business.phoneHref}>{business.phone}</a>
        <a href="#top">Нагору ↑</a>
      </div>
    </footer>
  );
}
