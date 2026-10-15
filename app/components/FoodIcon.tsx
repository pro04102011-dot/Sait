import type { MenuItem } from "@/lib/data";

// Прості SVG-ілюстрації для закусок і напоїв
export default function FoodIcon({ icon, className }: { icon: NonNullable<MenuItem["icon"]>; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {icon === "fries" && (
        <g>
          {[24, 32, 40, 48, 56, 64, 72].map((x, i) => (
            <rect key={x} x={x - 3} y={14 + (i % 3) * 6} width="7" height="50" rx="2" fill="#f7c948" stroke="#d9a21f" strokeWidth="1.5" transform={`rotate(${(i - 3) * 4} ${x} 60)`} />
          ))}
          <path d="M20 46 L80 46 L72 92 L28 92 Z" fill="#d6362b" />
          <path d="M20 46 L80 46 L78 56 L22 56 Z" fill="#b52a20" />
          <circle cx="50" cy="73" r="9" fill="#fff" opacity=".9" />
          <path d="M45 73 L55 73 M50 68 L50 78" stroke="#d6362b" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {icon === "nuggets" && (
        <g stroke="#b97a2e" strokeWidth="1.5">
          <ellipse cx="50" cy="78" rx="38" ry="10" fill="#f3efe7" stroke="#d8cfc0" />
          <path d="M22 66 Q18 48 34 46 Q48 44 46 60 Q44 74 30 74 Q24 73 22 66 Z" fill="#e6a650" />
          <path d="M50 64 Q50 46 66 48 Q82 50 78 64 Q74 76 62 74 Q50 72 50 64 Z" fill="#dd9a45" />
          <path d="M36 50 Q40 32 56 34 Q68 38 62 50 Q56 60 44 58 Q34 57 36 50 Z" fill="#eab25c" />
          <g fill="#c98a3a" stroke="none">
            <circle cx="30" cy="58" r="1.6" /><circle cx="38" cy="64" r="1.4" /><circle cx="64" cy="58" r="1.6" />
            <circle cx="70" cy="66" r="1.4" /><circle cx="48" cy="44" r="1.6" /><circle cx="54" cy="50" r="1.3" />
          </g>
        </g>
      )}
      {icon === "garlic" && (
        <g>
          <ellipse cx="50" cy="80" rx="40" ry="9" fill="#f3efe7" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${22 + i * 22} ${54 - (i % 2) * 6}) rotate(${-12 + i * 10})`}>
              <rect x="-14" y="-12" width="28" height="30" rx="9" fill="#e8b46a" stroke="#c2853c" strokeWidth="1.5" />
              <rect x="-10" y="-8" width="20" height="22" rx="6" fill="#f8dfa6" />
              <circle cx="-3" cy="-1" r="1.8" fill="#4f9a4a" /><circle cx="4" cy="5" r="1.6" fill="#4f9a4a" /><circle cx="-2" cy="9" r="1.4" fill="#4f9a4a" />
            </g>
          ))}
        </g>
      )}
      {icon === "salad" && (
        <g>
          <path d="M12 52 Q50 104 88 52 Z" fill="#fff" stroke="#d8cfc0" strokeWidth="2" />
          <path d="M18 52 Q22 30 38 36 Q44 22 58 32 Q72 24 80 40 Q88 44 84 52 Z" fill="#6fbf4a" />
          <path d="M26 50 Q34 38 44 46 M52 48 Q60 36 70 46" stroke="#4e9a33" strokeWidth="2" fill="none" />
          <rect x="34" y="40" width="10" height="10" rx="2" fill="#f2d39a" stroke="#cfa45e" strokeWidth="1.2" />
          <rect x="56" y="38" width="9" height="9" rx="2" fill="#f2d39a" stroke="#cfa45e" strokeWidth="1.2" />
          <path d="M44 42 l14 -4 l2 6 l-14 4 Z" fill="#e7c08a" stroke="#b8864a" strokeWidth="1.2" />
          <path d="M24 44 l8 -2 M66 44 l8 2" stroke="#fffbe8" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {icon === "cola" && (
        <g>
          <path d="M42 10 L58 10 L58 18 Q70 26 70 40 L70 86 Q70 92 64 92 L36 92 Q30 92 30 86 L30 40 Q30 26 42 18 Z" fill="#3a1d14" />
          <rect x="41" y="5" width="18" height="7" rx="2" fill="#d6362b" />
          <rect x="30" y="50" width="40" height="18" fill="#d6362b" />
          <path d="M36 60 Q50 52 64 60" stroke="#fff" strokeWidth="2.5" fill="none" />
          <path d="M36 28 Q38 22 44 20" stroke="#fff" strokeWidth="2" opacity=".35" fill="none" strokeLinecap="round" />
        </g>
      )}
      {icon === "juice" && (
        <g>
          <path d="M34 22 L66 22 L74 34 L74 90 L26 90 L26 34 Z" fill="#fbf6ec" stroke="#e6d9c2" strokeWidth="2" />
          <path d="M40 10 L60 10 L66 22 L34 22 Z" fill="#f39b1f" />
          <rect x="44" y="4" width="12" height="7" rx="2" fill="#3f8f4a" />
          <circle cx="50" cy="60" r="16" fill="#f7a524" />
          <circle cx="50" cy="60" r="12" fill="#ffc44d" />
          <path d="M50 48 L50 72 M38 60 L62 60 M41.5 51.5 L58.5 68.5 M58.5 51.5 L41.5 68.5" stroke="#f7a524" strokeWidth="1.5" />
        </g>
      )}
      {icon === "water" && (
        <g>
          <rect x="42" y="4" width="16" height="8" rx="2" fill="#2f7fc1" />
          <path d="M42 12 L58 12 L58 20 Q68 26 68 38 L68 88 Q68 94 62 94 L38 94 Q32 94 32 88 L32 38 Q32 26 42 20 Z" fill="#d9eefc" stroke="#9fcdee" strokeWidth="2" />
          <rect x="32" y="50" width="36" height="20" fill="#2f7fc1" />
          <path d="M50 54 Q44 61 50 66 Q56 61 50 54 Z" fill="#fff" />
        </g>
      )}
    </svg>
  );
}
