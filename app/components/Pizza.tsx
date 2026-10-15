import type { Topping } from "@/lib/data";

// Піца малюється у SVG — чітка на будь-якому екрані.
// Розкладка детермінована (від seed), тож сервер і браузер малюють однаково.
// Кожен вид начинки має власні позиції: додали новий — старі не зсуваються (для конструктора).

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

export function ToppingShape({ type }: { type: Topping }) {
  switch (type) {
    case "pepperoni":
      return (
        <g>
          <circle r="10" fill="#8f231c" />
          <circle r="8.4" fill="#c2382c" />
          <circle cx="-3" cy="-2" r="1.3" fill="#86211a" />
          <circle cx="3" cy="1" r="1.1" fill="#86211a" />
          <circle cx="-1" cy="4" r="1" fill="#86211a" />
          <path d="M-5 -5 A7 7 0 0 1 2 -7" stroke="#ec7a68" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "mushroom":
      return (
        <g>
          <path d="M-9 1 Q-9 -9 0 -9 Q9 -9 9 1 Z" fill="#efe3cf" stroke="#8f6e4a" strokeWidth="1.3" />
          <path d="M-3.5 1 L-3 7 Q0 9 3 7 L3.5 1 Z" fill="#e4d4ba" stroke="#8f6e4a" strokeWidth="1.3" />
        </g>
      );
    case "olive":
      return (
        <g>
          <circle r="5" fill="#231d17" />
          <circle r="2" fill="#f3c95e" />
        </g>
      );
    case "basil":
      return (
        <g>
          <path d="M0 -10 Q8 -3 0 10 Q-8 -3 0 -10 Z" fill="#358541" />
          <path d="M0 -8 L0 8" stroke="#246330" strokeWidth="1" />
        </g>
      );
    case "ham":
      return <rect x="-8" y="-6" width="16" height="12" rx="3.5" fill="#f2a5a2" stroke="#d6777b" strokeWidth="1.3" />;
    case "pineapple":
      return <path d="M-7 5 L0 -8 L7 5 Q0 8 -7 5 Z" fill="#f8d64e" stroke="#d9a923" strokeWidth="1.3" strokeLinejoin="round" />;
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
          <circle r="9" fill="#d3352a" />
          <circle r="6.6" fill="#ef6a55" />
          <path d="M0 -6 L0 6 M-5.2 -3 L5.2 3 M-5.2 3 L5.2 -3" stroke="#d3352a" strokeWidth="1.4" />
          <circle r="1.6" fill="#f9b08f" />
        </g>
      );
    case "pepper":
      return <path d="M-7 2 A7 7 0 0 1 7 2" fill="none" stroke="#3a9a40" strokeWidth="3.4" strokeLinecap="round" />;
    case "corn":
      return (
        <g fill="#f6c33b" stroke="#d49c1e" strokeWidth=".8">
          <ellipse cx="-3" cy="0" rx="2.6" ry="3.1" />
          <ellipse cx="3" cy="-1" rx="2.6" ry="3.1" />
          <ellipse cx="0" cy="4" rx="2.6" ry="3.1" />
        </g>
      );
    case "onion":
      return <path d="M-8 2 A8 8 0 0 1 8 2" fill="none" stroke="#c99ad3" strokeWidth="2.4" strokeLinecap="round" />;
    case "bacon":
      return (
        <g strokeLinecap="round" fill="none">
          <path d="M-10 0 Q-5 -5 0 0 T10 0" stroke="#9b3f2b" strokeWidth="5" />
          <path d="M-10 0 Q-5 -5 0 0 T10 0" stroke="#efb196" strokeWidth="1.6" />
        </g>
      );
    case "mozzarella":
      return <path d="M-9 -2 Q-8 -9 0 -8 Q9 -8 8 0 Q8 8 0 8 Q-9 8 -9 -2 Z" fill="#fff6dc" />;
    case "blue":
      return (
        <g>
          <path d="M-7 -3 Q-5 -8 1 -7 Q8 -5 6 2 Q3 7 -3 6 Q-8 3 -7 -3 Z" fill="#fbf3e2" />
          <circle cx="-2" cy="-2" r="1.4" fill="#6f87a8" />
          <circle cx="2" cy="2" r="1.2" fill="#6f87a8" />
          <circle cx="3" cy="-3" r=".9" fill="#6f87a8" />
        </g>
      );
  }
}

type Props = {
  toppings: Topping[];
  seed?: string;
  perType?: number; // скільки шматочків кожного виду
  drop?: boolean; // анімація «падіння» нової начинки
  className?: string;
  title?: string;
};

export default function Pizza({ toppings, seed = "pizza", perType, drop, className, title }: Props) {
  const base = hash(seed);
  const rand = rng(base);
  const id = `pz-${base.toString(36)}`;
  const n = perType ?? Math.max(5, Math.round(18 / Math.max(1, toppings.length)));

  // рум'яні плями на сирі
  const spots = Array.from({ length: 10 }, () => {
    const a = rand() * Math.PI * 2;
    const d = 14 + rand() * 56;
    return { x: r1(100 + Math.cos(a) * d), y: r1(100 + Math.sin(a) * d), r: r1(3 + rand() * 5) };
  });

  const golden = Math.PI * (3 - Math.sqrt(5));
  const layers = toppings.map((type) => {
    const tr = rng(hash(seed + type));
    const offset = tr() * Math.PI * 2;
    const items = Array.from({ length: n }, (_, i) => {
      const d = 64 * Math.sqrt((i + 0.3 + tr() * 0.6) / n);
      const a = offset + i * golden + (tr() - 0.5) * 0.5;
      return { x: r1(100 + Math.cos(a) * d), y: r1(100 + Math.sin(a) * d), rot: Math.round(tr() * 360) };
    });
    return { type, items };
  });

  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <radialGradient id={`${id}-crust`} cx="50%" cy="45%" r="55%">
          <stop offset="78%" stopColor="#e7aa5c" />
          <stop offset="91%" stopColor="#c9823a" />
          <stop offset="100%" stopColor="#8f5121" />
        </radialGradient>
        <radialGradient id={`${id}-cheese`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fcdf86" />
          <stop offset="100%" stopColor="#efb945" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#${id}-crust)`} />
      {/* підпалини на бортику — піца з печі */}
      {[20, 75, 140, 200, 260, 320].map((deg) => (
        <ellipse
          key={deg}
          cx={r1(100 + Math.cos((deg * Math.PI) / 180) * 91)}
          cy={r1(100 + Math.sin((deg * Math.PI) / 180) * 91)}
          rx="5" ry="3" fill="#5e3115" opacity=".55"
          transform={`rotate(${deg + 90} ${r1(100 + Math.cos((deg * Math.PI) / 180) * 91)} ${r1(100 + Math.sin((deg * Math.PI) / 180) * 91)})`}
        />
      ))}
      <circle cx="100" cy="100" r="86" fill="#bf3a28" />
      <path
        d="M100 20 C128 19 152 32 166 52 C179 71 183 96 177 120 C170 146 150 168 124 176 C100 183 72 180 52 165 C31 150 19 127 20 101 C21 75 34 50 56 34 C69 25 84 20 100 20 Z"
        fill={`url(#${id}-cheese)`}
      />
      {spots.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dc9a3c" opacity=".5" />
      ))}
      {layers.map((layer) => (
        <g key={layer.type}>
          {layer.items.map((t, i) => (
            <g key={i} transform={`translate(${t.x} ${t.y})`}>
              <g className={drop ? "pz-drop" : undefined} style={drop ? { animationDelay: `${i * 45}ms` } : undefined}>
                <g transform={`rotate(${t.rot})`}>
                  <ToppingShape type={layer.type} />
                </g>
              </g>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
