"use client";

import { useState } from "react";
import { builder, linePrice, sizes, toppingInfo, toppingPrice, type Size, type Topping } from "@/lib/data";
import { useCart } from "./Cart";
import Pizza, { ToppingShape } from "./Pizza";

const all = Object.keys(toppingInfo) as Topping[];

// Конструктор: тапаєш добавку — вона «падає» на піцу, ціна рахується одразу
export default function Builder() {
  const [picked, setPicked] = useState<Topping[]>(["pepperoni", "mushroom"]);
  const [size, setSize] = useState<Size>("30");
  const [done, setDone] = useState(false);
  const cart = useCart();

  const full = picked.length >= builder.maxToppings;
  const price = linePrice({ id: "custom", size, toppings: picked }) ?? 0;

  const toggle = (t: Topping) => {
    setDone(false);
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : p.length < builder.maxToppings ? [...p, t] : p));
  };
  const add = () => {
    cart.add({ id: "custom", size, toppings: [...picked].sort() });
    setDone(true);
  };

  return (
    <section className="build" id="build">
      <div className="wrap">
        <header className="build__head">
          <h2 className="eyebrow eyebrow--dark">Конструктор</h2>
          <p className="build__title">Збери <span>свою</span> піцу</p>
          <p className="build__sub">
            Основа — тісто, томатний соус і моцарела ({builder.base[size]} ₴). Додай до {builder.maxToppings} начинок — ми спечемо саме таку.
          </p>
        </header>

        <div className="build__grid">
          <div className="build__stage">
            <div className="build__peel" />
            <div className={`build__pizza ${size === "40" ? "is-big" : ""}`}>
              <Pizza toppings={picked} seed="builder" perType={7} drop />
            </div>
          </div>

          <div className="build__panel">
            <div className="toppings">
              {all.map((t) => {
                const on = picked.includes(t);
                return (
                  <button
                    key={t}
                    className={`topping ${on ? "is-on" : ""}`}
                    onClick={() => toggle(t)}
                    disabled={!on && full}
                    aria-pressed={on}
                  >
                    <svg viewBox="-12 -12 24 24" aria-hidden><ToppingShape type={t} /></svg>
                    <span>{toppingInfo[t].label}</span>
                    <small>+{toppingPrice(t, size)} ₴</small>
                  </button>
                );
              })}
            </div>
            <p className="build__count">
              {picked.length}/{builder.maxToppings} начинок
              {picked.length > 0 && <button onClick={() => { setPicked([]); setDone(false); }}>очистити</button>}
            </p>
            <div className="build__foot">
              <div className="seg seg--dark" role="radiogroup" aria-label="Розмір">
                {sizes.map((s) => (
                  <button key={s.id} role="radio" aria-checked={size === s.id} className={size === s.id ? "is-on" : ""} onClick={() => setSize(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
              <span className="build__price">{price} ₴</span>
              <button className="btn btn--fire" onClick={add}>{done ? "✓ У кошику" : "Спекти таку"}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
