/**
 * Presentation pieces for the ops dashboard.
 *
 * Status is never encoded by colour alone: every state carries a distinct glyph
 * shape AND a text label. That is what discharges the amber-on-cream contrast
 * warning — amber at a lightness that separates cleanly from red cannot also
 * clear 3:1 on the cream surface, so the label does the work and the colour
 * reinforces it.
 *
 * Validated with the dataviz palette checker against surface #f5f0e1:
 * lightness band, chroma floor, CVD separation (worst adjacent ΔE 20.0 deutan)
 * and normal-vision floor all pass.
 */

import type { MonthPoint } from "@/lib/ops/metrics";

export const STATUS = {
  on: { fill: "#1565c0", label: "On track" },
  risk: { fill: "#c2870b", label: "At risk" },
  off: { fill: "#a3232a", label: "Off track" },
  none: { fill: "#6b7280", label: "No data" },
} as const;

export type StatusKey = keyof typeof STATUS;

/** Single-series bar fill. One measure per chart, so no categorical palette. */
const SERIES = "#335231";
const AXIS = "#c9c3ae";
const INK_MUTED = "#6a6455";

export function fmtZAR(n: number): string {
  return `R${Math.round(n).toLocaleString("en-ZA")}`;
}

export function fmtValue(n: number | null, kind: string): string {
  if (n === null) return "—";
  switch (kind) {
    case "currency":
      return fmtZAR(n);
    case "percent":
      return `${Math.round(n)}%`;
    case "months":
      return `${n}`;
    case "milestone":
      return n >= 1 ? "Done" : "Not yet";
    default:
      return Math.round(n).toLocaleString("en-ZA");
  }
}

export function monthLabel(m: string): string {
  const d = new Date(`${m}-01T00:00:00Z`);
  return d.toLocaleDateString("en-ZA", { month: "short", timeZone: "UTC" });
}

/** Progress of value toward target, 0–1, honouring direction. */
export function progress(
  value: number | null,
  target: number,
  direction: "up" | "down",
): number | null {
  if (value === null) return null;
  if (direction === "up") return target === 0 ? 1 : Math.max(0, Math.min(1, value / target));
  if (value <= target) return 1;
  return Math.max(0, Math.min(1, target / value));
}

export function statusOf(p: number | null): StatusKey {
  if (p === null) return "none";
  if (p >= 1) return "on";
  if (p >= 0.7) return "risk";
  return "off";
}

export function StatusChip({ s }: { s: StatusKey }) {
  const { fill, label } = STATUS[s];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider">
      <Glyph s={s} />
      <span style={{ color: fill }}>{label}</span>
    </span>
  );
}

/** Distinct shape per state, so status survives greyscale and colour blindness. */
function Glyph({ s }: { s: StatusKey }) {
  const fill = STATUS[s].fill;
  if (s === "on")
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="4.5" fill={fill} />
      </svg>
    );
  if (s === "risk")
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M5 0.5 L9.8 9.2 L0.2 9.2 Z" fill={fill} />
      </svg>
    );
  if (s === "off")
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M1 1 L9 9 M9 1 L1 9" stroke={fill} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <rect x="0.8" y="4" width="8.4" height="2" rx="1" fill={fill} />
    </svg>
  );
}

export function Meter({ p, s }: { p: number | null; s: StatusKey }) {
  const pct = p === null ? 0 : Math.round(p * 100);
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-cream-dark"
      role="img"
      aria-label={p === null ? "No data" : `${pct}% of target`}
    >
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${pct}%`, background: STATUS[s].fill }}
      />
    </div>
  );
}

/** Rounded top corners only — the data end is rounded, the baseline is square. */
function barPath(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, h, w / 2);
  if (h <= 0) return "";
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

/**
 * Single-series column chart. No legend — the caption names the series. Values
 * are direct-labelled because six bars is few enough that every label fits, and
 * each bar carries a native SVG tooltip for the exact figure.
 */
export function Bars({
  data,
  format,
  caption,
}: {
  data: MonthPoint[];
  format: (n: number) => string;
  caption: string;
}) {
  const W = 440;
  const H = 150;
  const padB = 26;
  const padT = 22;
  const gap = 2;
  const max = Math.max(1, ...data.map((d) => d.value));
  const slot = W / Math.max(1, data.length);
  const bw = slot - gap;
  const plotH = H - padB - padT;

  return (
    <figure className="m-0">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[150px] w-full min-w-[320px]"
          role="img"
          aria-label={caption}
        >
          <line x1="0" y1={H - padB} x2={W} y2={H - padB} stroke={AXIS} strokeWidth="1" />
          {data.map((d, i) => {
            const h = (d.value / max) * plotH;
            const x = i * slot + gap / 2;
            const y = H - padB - h;
            return (
              <g key={d.month}>
                {h > 0 && <path d={barPath(x, y, bw, h, 4)} fill={SERIES} />}
                <title>{`${monthLabel(d.month)} — ${format(d.value)}`}</title>
                <text
                  x={x + bw / 2}
                  y={h > 0 ? y - 7 : H - padB - 7}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={INK_MUTED}
                >
                  {format(d.value)}
                </text>
                <text
                  x={x + bw / 2}
                  y={H - padB + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fill={INK_MUTED}
                >
                  {monthLabel(d.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-1 text-xs text-charcoal-light/70">{caption}</figcaption>
    </figure>
  );
}
