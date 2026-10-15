"use client";

import { useRef, useState } from "react";
import { pizzas, sizes, toppingInfo, type Size } from "@/lib/data";
import { useCart } from "./Cart";
import Pizza from "./Pizza";

// Меню-«програвач»: одна велика піца по центру, перемикання — стрілками, свайпом або зі списку.

export default function PizzaDial() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [size, setSize] = useState<Size>("30");
  const [added, setAdded] = useState(0);
  const cart = useCart();
  const touch = useRef<number | null>(null);

  const pizza = pizzas[index];
  const go = (next: number) => {
    const n = (next + pizzas.length) % pizzas.length;
    if (n === index) return;
    setDir(next > index ? 1 : -1);
    setIndex(n);
    setAdded(0);
  };
  const add = () => {
    cart.add({ id: pizza.id, size });
    setAdded(Date.now());
  };

  return (
    <section className="dial" id="menu">
      <div className="dial__bg-num" aria-hidden>{String(index + 1).padStart(2, "0")}</div>
      <div className="wrap dial__grid">
        <div className="dial__list">
          <h2 className="eyebrow">Меню · {pizzas.length} піц</h2>
          <ol>
            {pizzas.map((p, i) => (
              <li key={p.id}>
                <button className={i === index ? "is-on" : ""} onClick={() => go(i)}>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {p.name}
                  {p.tag && <em>{p.tag}</em>}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div
          className="dial__stage"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
            touch.current = null;
          }}
        >
          <div className="dial__board" />
          <div key={pizza.id} className={`dial__pizza ${dir > 0 ? "from-right" : "from-left"} ${size === "40" ? "is-big" : ""}`}>
            <Pizza toppings={pizza.toppings} seed={pizza.id} title={pizza.name} />
          </div>
          <button className="dial__arrow dial__arrow--prev" onClick={() => go(index - 1)} aria-label="Попередня піца">←</button>
          <button className="dial__arrow dial__arrow--next" onClick={() => go(index + 1)} aria-label="Наступна піца">→</button>
        </div>

        <div className="dial__info" key={`info-${pizza.id}`}>
          <h3>{pizza.name}</h3>
          <p>{pizza.description}</p>
          <ul className="chips">
            {pizza.toppings.map((t) => <li key={t}>{toppingInfo[t].label}</li>)}
          </ul>
          <div className="seg" role="radiogroup" aria-label="Розмір">
            {sizes.map((s) => (
              <button key={s.id} role="radio" aria-checked={size === s.id} className={size === s.id ? "is-on" : ""} onClick={() => setSize(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="dial__buy">
            <span className="dial__price">{pizza.prices[size]}<small> ₴</small></span>
            <button className="btn btn--fire" onClick={add}>
              <span key={added} className={added ? "pop" : undefined}>{added ? "Ще одну?" : "У кошик"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
