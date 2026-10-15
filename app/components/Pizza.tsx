import type { Topping } from "@/lib/data";

// Піца малюється у SVG — чітка на будь-якому екрані.
// Розкладка начинки детермінована (від seed), тож сервер і браузер малюють однаково.

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function ToppingShape({ type }: { type: Topping }) {
  switch (type) {
    case "pepperoni":
      return (
        <g>
          <circle r="10" fill="#9e2a22" />
          <circle r="8.4" fill="#c83c30" />
          <circle cx="-3" cy="-2" r="1.3" fill="#8e2219" />
          <circle cx="3" cy="1" r="1.1" fill="#8e2219" />
          <circle cx="-1" cy="4" r="1" fill="#8e2219" />
          <path d="M-5 -5 A7 7 0 0 1 2 -7" stroke="#e8705f" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      );
    case "mushroom":
      return (
        <g>
          <path d="M-9 1 Q-9 -9 0 -9 Q9 -9 9 1 Z" fill="#efe3cf" stroke="#9c7a54" strokeWidth="1.3" />
          <path d="M-3.5 1 L-3 7 Q0 9 3 7 L3.5 1 Z" fill="#e4d4ba" stroke="#9c7a54" strokeWidth="1.3" />
        </g>
      );
    case "olive":
      return (
        <g>
          <circle r="5" fill="#2a231c" />
          <circle r="2" fill="#f3c95e" />
        </g>
      );
    case "basil":
      return (
        <g>
          <path d="M0 -10 Q8 -3 0 10 Q-8 -3 0 -10 Z" fill="#3c8c46" />
          <path d="M0 -8 L0 8" stroke="#2b6b33" strokeWidth="1" />
        </g>
      );
    case "ham":
      return <rect x="-8" y="-6" width="16" height="12" rx="3.5" fill="#f2a5a2" stroke="#dc7d80" strokeWidth="1.3" />;
    case "pineapple":
      return <path d="M-7 5 L0 -8 L7 5 Q0 8 -7 5 Z" fill="#f8d64e" stroke="#ddb02a" strokeWidth="1.3" strokeLinejoin="round" />;
    case "chili":
      return (
        <g>
          <circle r="4.6" fill="none" stroke="#d61f17" strokeWidth="2.6" />
          <circle cx="-1" cy="0" r=".9" fill="#f6e27a" />
          <circle cx="1.4" cy="1" r=".9" fill="#f6e27a" />
        </g>
      );
    case "tomato":
      return (
        <g>
          <circle r="9" fill="#d93a2e" />
          <circle r="6.6" fill="#ef6a55" />
          <path d="M0 -6 L0 6 M-5.2 -3 L5.2 3 M-5.2 3 L5.2 -3" stroke="#d93a2e" strokeWidth="1.4" />
          <circle r="1.6" fill="#f9b08f" />
        </g>
      );
    case "pepper":
      return <path d="M-7 2 A7 7 0 0 1 7 2" fill="none" stroke="#3f9e44" strokeWidth="3.4" strokeLinecap="round" />;
    case "corn":
      return (
        <g fill="#f6c33b" stroke="#dca222" strokeWidth=".8">
          <ellipse cx="-3" cy="0" rx="2.6" ry="3.1" />
          <ellipse cx="3" cy="-1" rx="2.6" ry="3.1" />
          <ellipse cx="0" cy="4" rx="2.6" ry="3.1" />
        </g>
      );
    case "onion":
      return <path d="M-8 2 A8 8 0 0 1 8 2" fill="none" stroke="#efe0f2" strokeWidth="2.4" strokeLinecap="round" />;
    case "bacon":
      return (
        <g strokeLinecap="round" fill="none">
          <path d="M-10 0 Q-5 -5 0 0 T10 0" stroke="#a8452f" strokeWidth="5" />
          <path d="M-10 0 Q-5 -5 0 0 T10 0" stroke="#efb196" strokeWidth="1.6" />
        </g>
      );
    case "mozzarella":
      return <path d="M-9 -2 Q-8 -9 0 -8 Q9 -8 8 0 Q8 8 0 8 Q-9 8 -9 -2 Z" fill="#fff6dc" />;
    case "blue":
      return (
        <g>
          <path d="M-7 -3 Q-5 -8 1 -7 Q8 -5 6 2 Q3 7 -3 6 Q-8 3 -7 -3 Z" fill="#fbf3e2" />
          <circle cx="-2" cy="-2" r="1.4" fill="#7f95b1" />
          <circle cx="2" cy="2" r="1.2" fill="#7f95b1" />
          <circle cx="3" cy="-3" r=".9" fill="#7f95b1" />
        </g>
      );
  }
}

type Props = {
  toppings: Topping[];
  seed?: string;
  count?: number;
  className?: string;
  title?: string;
};

export default function Pizza({ toppings, seed = toppings.join(), count = 16, className, title }: Props) {
  const rand = rng(hash(seed));
  const id = `pz-${hash(seed).toString(36)}`;

  // рум'яні плями на сирі
  const spots = Array.from({ length: 9 }, () => {
    const a = rand() * Math.PI * 2;
    const d = 18 + rand() * 52;
    return { x: r1(100 + Math.cos(a) * d), y: r1(100 + Math.sin(a) * d), r: r1(3 + rand() * 5) };
  });

  // начинка по спіралі «золотого кута» — рівномірно, без купок
  const golden = Math.PI * (3 - Math.sqrt(5));
  const offset = rand() * Math.PI * 2;
  const items = Array.from({ length: count }, (_, i) => {
    const d = 66 * Math.sqrt((i + 0.6) / count);
    const a = offset + i * golden;
    return {
      type: toppings[i % toppings.length],
      x: r1(100 + Math.cos(a) * d),
      y: r1(100 + Math.sin(a) * d),
      rot: Math.round(rand() * 360),
    };
  });

  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <radialGradient id={`${id}-crust`} cx="50%" cy="45%" r="55%">
          <stop offset="78%" stopColor="#e9b066" />
          <stop offset="92%" stopColor="#d48d42" />
          <stop offset="100%" stopColor="#b8702e" />
        </radialGradient>
        <radialGradient id={`${id}-cheese`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbdc80" />
          <stop offset="100%" stopColor="#f1bf4f" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#${id}-crust)`} />
      <circle cx="100" cy="100" r="86" fill="#c5402c" />
      <path
        d="M100 20 C128 19 152 32 166 52 C179 71 183 96 177 120 C170 146 150 168 124 176 C100 183 72 180 52 165 C31 150 19 127 20 101 C21 75 34 50 56 34 C69 25 84 20 100 20 Z"
        fill={`url(#${id}-cheese)`}
      />
      {spots.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e3a446" opacity=".55" />
      ))}
      {items.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y}) rotate(${t.rot})`}>
          <ToppingShape type={t.type} />
        </g>
      ))}
      <circle cx="100" cy="100" r="93" fill="none" stroke="#f5cc86" strokeWidth="2" opacity=".6" strokeDasharray="10 14" />
    </svg>
  );
}
