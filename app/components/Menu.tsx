"use client";

import { useState } from "react";
import { categories, menu, priceOf, sizes, type Category, type MenuItem, type Size } from "@/lib/data";
import { useCart } from "./Cart";
import Pizza from "./Pizza";
import FoodIcon from "./FoodIcon";

function Card({ item }: { item: MenuItem }) {
  const isPizza = typeof item.prices !== "number";
  const [size, setSize] = useState<Size>("30");
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const price = priceOf(item, isPizza ? size : undefined) ?? 0;

  const add = () => {
    cart.add(item.id, isPizza ? size : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="card">
      <div className="card__img">
        {item.toppings ? (
          <Pizza toppings={item.toppings} seed={item.id} className={`card__pizza ${size === "40" ? "card__pizza--big" : ""}`} />
        ) : item.icon ? (
          <FoodIcon icon={item.icon} className="card__icon" />
        ) : null}
        {item.badge && <span className="badge">{item.badge}</span>}
        {item.spicy && <span className="badge badge--hot">🌶 Гостра</span>}
      </div>
      <div className="card__body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        {isPizza ? (
          <div className="sizes" role="radiogroup" aria-label="Розмір">
            {sizes.map((s) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={size === s.id}
                className={`sizes__btn ${size === s.id ? "sizes__btn--active" : ""}`}
                onClick={() => setSize(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          item.weight && <span className="weight">{item.weight}</span>
        )}
        <div className="card__foot">
          <span className="price">{price} ₴</span>
          <button className={`btn btn--small ${added ? "btn--done" : ""}`} onClick={add}>
            {added ? "✓ Додано" : "У кошик"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const [cat, setCat] = useState<Category>("pizza");
  const items = menu.filter((m) => m.category === cat);

  return (
    <section className="section" id="menu">
      <div className="container">
        <h2 className="section__title">Меню</h2>
        <p className="section__sub">Обирайте, додавайте в кошик — і за годину піца у вас</p>
        <div className="tabs" role="tablist">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              className={`tab ${cat === c.id ? "tab--active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid" key={cat}>
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
