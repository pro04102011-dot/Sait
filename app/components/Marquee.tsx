// Нескінченна бігуча стрічка
export default function Marquee({ words, reverse, tone = "fire" }: { words: string[]; reverse?: boolean; tone?: "fire" | "cream" }) {
  const row = words.flatMap((w, i) => [<span key={`w${i}`}>{w}</span>, <b key={`s${i}`}>✺</b>]);
  return (
    <div className={`marquee marquee--${tone} ${reverse ? "marquee--rev" : ""}`} aria-hidden>
      <div className="marquee__track">
        <div className="marquee__row">{row}</div>
        <div className="marquee__row">{row}</div>
      </div>
    </div>
  );
}
