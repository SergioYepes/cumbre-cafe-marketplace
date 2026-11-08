import type { Tone } from "@/lib/format";

export function StatusTag({ map, value }: { map: Record<string, { label: string; tone: Tone }>; value: string }) {
  const s = map[value] ?? { label: value, tone: "muted" as Tone };
  return <span className={`tag tag-${s.tone}`}>{s.label}</span>;
}

export function Stars({ value, count }: { value: number; count?: number }) {
  const full = Math.round(value);
  return (
    <span className="row-flex" style={{ gap: ".4rem" }}>
      <span className="stars" aria-label={`${value} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= full ? "" : "off"}>★</span>
        ))}
      </span>
      {count !== undefined && <span className="meta">({count})</span>}
    </span>
  );
}

export function RoastMeter({ level }: { level: number }) {
  return (
    <span className="roast-meter" aria-label={`Tueste ${level} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= level ? "on" : ""} />
      ))}
    </span>
  );
}

export function BrandMark({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  // Color estable derivado del nombre
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const bg = `linear-gradient(135deg, hsl(${(h % 40) + 20} 70% 62%), hsl(${(h % 30) + 10} 60% 45%))`;
  return (
    <div className={`mark ${size === "lg" ? "mark-lg" : ""}`} style={{ background: bg }} aria-hidden>
      {name[0]}
    </div>
  );
}
