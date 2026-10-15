"use client";

import { useEffect, useRef } from "react";
import Pizza from "./Pizza";

// Сцена «піца виїжджає з печі»: секція висотою 230vh, всередині — sticky-екран.
// Прогрес прокрутки 0→1 плавно (експоненційне згладжування) рухає піцу з жерла печі до глядача.

const SMOOTH = 0.12; // секунди; більше — плавніше, але «важче»
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// жарини: детерміновані параметри, щоб SSR і браузер збігалися
const embers = Array.from({ length: 16 }, (_, i) => ({
  left: 36 + ((i * 37) % 28),
  size: 2 + (i % 3),
  dur: 2.6 + ((i * 7) % 10) / 4,
  delay: -((i * 13) % 40) / 10,
  drift: ((i % 5) - 2) * 14,
}));

function OvenSvg() {
  const voussoirs = Array.from({ length: 11 }, (_, i) => (Math.PI * (i + 0.5)) / 11);
  return (
    <svg viewBox="0 0 600 520" className="oven__svg" aria-hidden>
      <defs>
        <pattern id="brick" width="64" height="32" patternUnits="userSpaceOnUse">
          <rect width="64" height="32" fill="#7a2f1c" />
          <rect x="2" y="2" width="60" height="13" rx="2" fill="#a5452a" />
          <rect x="-30" y="18" width="60" height="13" rx="2" fill="#9a3f26" />
          <rect x="34" y="18" width="60" height="13" rx="2" fill="#ad4c2e" />
        </pattern>
        <radialGradient id="domeShade" cx="50%" cy="35%" r="65%">
          <stop offset="40%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".65" />
        </radialGradient>
        <radialGradient id="inside" cx="50%" cy="92%" r="75%">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="22%" stopColor="#ff8a2a" />
          <stop offset="48%" stopColor="#a32a0e" />
          <stop offset="78%" stopColor="#2a0b05" />
          <stop offset="100%" stopColor="#120503" />
        </radialGradient>
        <radialGradient id="mouthGlow" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#ff9a3c" stopOpacity=".55" />
          <stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <clipPath id="mouth">
          <path d="M165 470 L165 360 C165 283 227 238 300 238 C373 238 435 283 435 360 L435 470 Z" />
        </clipPath>
      </defs>

      {/* димар */}
      <rect x="262" y="8" width="76" height="80" fill="url(#brick)" />
      <rect x="252" y="0" width="96" height="16" rx="3" fill="#3a2a24" />
      {/* купол */}
      <path d="M54 476 L54 300 C54 146 166 56 300 56 C434 56 546 146 546 300 L546 476 Z" fill="url(#brick)" />
      <path d="M54 476 L54 300 C54 146 166 56 300 56 C434 56 546 146 546 300 L546 476 Z" fill="url(#domeShade)" />
      {/* відблиск вогню на цеглі */}
      <ellipse cx="300" cy="420" rx="230" ry="140" fill="url(#mouthGlow)" className="oven__reflect" />
      {/* арка з клинчастої цегли */}
      <path d="M140 476 L140 360 C140 268 214 212 300 212 C386 212 460 268 460 360 L460 476 Z" fill="#c8693f" />
      {voussoirs.map((a, i) => {
        const cx = 300, cy = 360;
        const x1 = cx - Math.cos(a) * 136, y1 = cy - Math.sin(a) * 118;
        const x2 = cx - Math.cos(a) * 162, y2 = cy - Math.sin(a) * 148;
        return <line key={i} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} stroke="#7a2f1c" strokeWidth="4" />;
      })}
      <line x1="140" y1="400" x2="165" y2="400" stroke="#7a2f1c" strokeWidth="4" />
      <line x1="435" y1="400" x2="460" y2="400" stroke="#7a2f1c" strokeWidth="4" />
      {/* жерло */}
      <path d="M165 470 L165 360 C165 283 227 238 300 238 C373 238 435 283 435 360 L435 470 Z" fill="url(#inside)" />
      <g clipPath="url(#mouth)">
        {/* дрова та полум'я в глибині */}
        <rect x="246" y="430" width="70" height="14" rx="7" fill="#2a140c" transform="rotate(-12 281 437)" />
        <rect x="282" y="432" width="74" height="14" rx="7" fill="#3a1c10" transform="rotate(10 319 439)" />
        <g className="flame flame--1"><path d="M300 446 C262 430 270 384 292 360 C290 384 306 388 310 372 C334 396 344 430 300 446 Z" fill="#ff6a1a" /></g>
        <g className="flame flame--2"><path d="M268 448 C246 432 252 404 266 388 C268 404 278 408 282 398 C296 414 296 440 268 448 Z" fill="#ff8f22" /></g>
        <g className="flame flame--3"><path d="M334 448 C312 438 318 410 330 394 C332 410 342 412 346 402 C360 420 356 442 334 448 Z" fill="#ff8f22" /></g>
        <g className="flame flame--4"><path d="M300 448 C282 440 286 414 298 400 C300 414 308 414 310 406 C320 420 318 442 300 448 Z" fill="#ffd36b" /></g>
        {/* під печі */}
        <ellipse cx="300" cy="468" rx="150" ry="22" fill="#5a2210" opacity=".75" />
      </g>
      {/* стіл-постамент */}
      <rect x="20" y="470" width="560" height="50" rx="6" fill="#2b211d" />
      <rect x="20" y="470" width="560" height="8" rx="4" fill="#3d302a" />
    </svg>
  );
}

export default function OvenHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pizzaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!, stage = stageRef.current!, pizza = pizzaRef.current!;
    const title = titleRef.current!, final = finalRef.current!, hint = hintRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cur = -1;
    let last = performance.now();
    let raf = 0;

    const target = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? clamp(-r.top / total) : 0;
    };

    const render = (p: number) => {
      const W = stage.parentElement!.clientWidth;
      const H = stage.parentElement!.clientHeight;
      // розміри без урахування transform — offset*
      const k = stage.offsetWidth / 600;
      const mx = stage.offsetLeft + 300 * k;
      const my = stage.offsetTop + 452 * k;
      const S = pizza.offsetWidth;

      const e = easeInOut(clamp((p - 0.04) / 0.8));
      const x = mx + (W / 2 - mx) * e;
      const y = my + (H * 0.45 - my) * e;
      const s = (200 * k) / S + (1 - (200 * k) / S) * e;
      const tilt = 74 * (1 - e);
      const spin = 220 * e;
      pizza.style.transform =
        `translate3d(${(x - S / 2).toFixed(1)}px, ${(y - S / 2).toFixed(1)}px, 0) ` +
        `perspective(1000px) rotateX(${tilt.toFixed(2)}deg) rotate(${spin.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      pizza.style.opacity = "1"; // до першого кадру прихована (CSS), щоб не блимала в кутку
      // поки піца в печі — її «підсвічує» вогонь
      pizza.style.filter = `brightness(${(0.72 + 0.28 * smooth(0.05, 0.4, p)).toFixed(3)}) drop-shadow(0 ${(30 * e).toFixed(1)}px ${(40 * e).toFixed(1)}px rgba(0,0,0,.55))`;

      stage.style.transform = `scale(${(1 + e * 0.7).toFixed(4)})`;
      stage.style.opacity = (1 - smooth(0.3, 0.8, p)).toFixed(3);
      title.style.opacity = (1 - smooth(0.02, 0.32, p)).toFixed(3);
      title.style.transform = `translate3d(0, ${(-p * 120).toFixed(1)}px, 0)`;
      hint.style.opacity = (1 - smooth(0, 0.08, p)).toFixed(3);
      const f = smooth(0.68, 0.95, p);
      final.style.opacity = f.toFixed(3);
      final.style.transform = `translate3d(0, ${((1 - f) * 40).toFixed(1)}px, 0)`;
      final.style.pointerEvents = f > 0.5 ? "auto" : "none";
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = target();
      cur = cur < 0 || reduce ? t : cur + (t - cur) * (1 - Math.exp(-dt / SMOOTH));
      if (Math.abs(t - cur) < 0.0004) cur = t;
      render(cur);
      raf = Math.abs(t - cur) > 0 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onResize = () => render(cur < 0 ? target() : cur);

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="oven" id="top" ref={sectionRef}>
      <div className="oven__sticky">
        <div className="oven__heat" />
        <div className="oven__title" ref={titleRef}>
          <p className="oven__kicker">піцерія · Київ, Оболонь</p>
          <h1>Пічка</h1>
        </div>

        <div className="oven__stage" ref={stageRef}>
          <OvenSvg />
          <div className="embers" aria-hidden>
            {embers.map((e, i) => (
              <span
                key={i}
                style={{
                  left: `${e.left}%`, width: e.size, height: e.size,
                  animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s`,
                  ["--drift" as string]: `${e.drift}px`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="oven__pizza" ref={pizzaRef}>
          <Pizza toppings={["pepperoni", "mozzarella", "basil"]} seed="oven" perType={9} title="Піца пепероні" />
        </div>

        <div className="oven__final" ref={finalRef}>
          <h2>Гаряча. Тягуча. <em>Твоя.</em></h2>
          <div className="oven__actions">
            <a href="#menu" className="btn btn--fire">Обрати піцу</a>
            <a href="#build" className="btn btn--line">Зібрати свою</a>
          </div>
        </div>

        <div className="oven__hint" ref={hintRef}>
          <span>гортай — дістанемо з печі</span>
          <i />
        </div>
      </div>
    </section>
  );
}
