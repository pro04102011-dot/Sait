import { business, delivery, features } from "@/lib/data";
import Pizza from "./Pizza";

export function Features() {
  return (
    <section className="section section--alt">
      <div className="container">
        <h2 className="section__title">Чому «{business.name}»</h2>
        <div className="features">
          {features.map((f) => (
            <div key={f.title} className="feature">
              <div className="feature__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Delivery() {
  const steps = [
    { n: "1", title: "Обираєте", text: "Додаєте піцу та закуски в кошик на сайті або телефонуєте нам." },
    { n: "2", title: "Готуємо", text: "Розкочуємо тісто, викладаємо начинку і відправляємо в піч." },
    { n: "3", title: "Привозимо", text: `Кур'єр привезе замовлення гарячим за ${delivery.time}.` },
  ];
  return (
    <section className="section" id="delivery">
      <div className="container">
        <h2 className="section__title">Доставка</h2>
        <p className="section__sub">
          Доставка — {delivery.price} ₴, а від {delivery.freeFrom} ₴ — безкоштовно. Самовивіз — завжди безкоштовно.
        </p>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n} className="step">
              <span className="step__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section section--dark" id="about">
      <div className="container about">
        <div className="about__art">
          <Pizza toppings={["mushroom", "bacon", "onion", "basil"]} seed="about" count={20} className="about__pizza" />
        </div>
        <div>
          <h2 className="section__title section__title--left">Про нас</h2>
          <p>
            «{business.name}» — невелика піцерія для своїх. Ми не мережа і не фабрика: тісто замішуємо самі,
            даємо йому дозріти, а кожну піцу збираємо руками перед тим, як відправити в піч.
          </p>
          <p>
            Беремо прості й чесні продукти — справжню моцарелу, ароматний томатний соус і свіжі овочі.
            Тому піца виходить такою, яку хочеться замовити ще раз.
          </p>
          <a href="#menu" className="btn">Подивитися меню</a>
        </div>
      </div>
    </section>
  );
}

export function Contacts() {
  return (
    <section className="section section--alt" id="contacts">
      <div className="container contacts">
        <div>
          <h2 className="section__title section__title--left">Контакти</h2>
          <ul className="info">
            <li>📍 {business.address}</li>
            <li>📞 <a href={business.phoneHref}>{business.phone}</a></li>
            {business.hours.map((h) => (
              <li key={h.days}>🕙 {h.days}: {h.time}</li>
            ))}
          </ul>
          <div className="contacts__actions">
            <a href={business.googleMaps} className="btn" target="_blank" rel="noopener noreferrer">Відкрити в Google Maps</a>
            <a href={business.phoneHref} className="btn btn--ghost">Зателефонувати</a>
          </div>
        </div>
        <div className="map">
          <iframe
            title={`${business.name} на карті`}
            src="https://maps.google.com/maps?q=50.5117846,30.4666473&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© {business.name} — піцерія</span>
        <a href={business.phoneHref}>{business.phone}</a>
      </div>
    </footer>
  );
}
