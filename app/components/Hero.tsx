import { business, delivery } from "@/lib/data";
import Pizza from "./Pizza";

function Leaf() {
  return (
    <svg viewBox="-12 -12 24 24" className="hero__pic" aria-hidden>
      <path d="M0 -10 Q8 -3 0 10 Q-8 -3 0 -10 Z" fill="#3c8c46" />
      <path d="M0 -8 L0 8" stroke="#2b6b33" strokeWidth="1" />
    </svg>
  );
}
function Tomato() {
  return (
    <svg viewBox="-12 -12 24 24" className="hero__pic" aria-hidden>
      <circle r="10" fill="#d93a2e" />
      <circle r="7.4" fill="#ef6a55" />
      <path d="M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5" stroke="#d93a2e" strokeWidth="1.4" />
      <circle r="1.8" fill="#f9b08f" />
    </svg>
  );
}
function Chili() {
  return (
    <svg viewBox="-12 -12 24 24" className="hero__pic" aria-hidden>
      <path d="M-8 -6 Q-2 -2 2 4 Q6 9 10 9 Q4 11 -1 7 Q-7 2 -8 -6 Z" fill="#d61f17" />
      <path d="M-8 -6 Q-10 -9 -7 -10" stroke="#3c8c46" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__badge">🔥 Доставка за {delivery.time}</p>
          <h1>
            Піца з печі,<br />
            <span className="accent">яка тягнеться</span>
          </h1>
          <p className="lead">{business.tagline}. Замовляйте на сайті — привеземо гарячою.</p>
          <div className="hero__actions">
            <a href="#menu" className="btn">Обрати піцу</a>
            <a href={business.phoneHref} className="btn btn--ghost">Зателефонувати</a>
          </div>
          <ul className="hero__facts">
            <li><strong>8</strong> видів піци</li>
            <li><strong>30/40</strong> см</li>
            <li><strong>від {delivery.freeFrom} ₴</strong> доставка безкоштовно</li>
          </ul>
        </div>

        <div className="hero__art">
          <div className="hero__plate">
            <Pizza
              toppings={["pepperoni", "mozzarella", "basil", "olive"]}
              seed="hero"
              count={24}
              className="hero__pizza"
              title="Піца пепероні"
            />
          </div>
          <span className="hero__float hero__float--1"><Leaf /></span>
          <span className="hero__float hero__float--2"><Tomato /></span>
          <span className="hero__float hero__float--3"><Chili /></span>
          <span className="hero__float hero__float--4"><Leaf /></span>
        </div>
      </div>
    </section>
  );
}
