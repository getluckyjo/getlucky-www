import type { LucideIcon } from "lucide-react";

export type Feature = { icon: LucideIcon; title: string; body: string };

/**
 * A grid of features without boxes: a soft icon tile, an Inter title and a
 * muted line of copy, separated by hairlines. Reads as a spec sheet rather
 * than a wall of cards.
 */
export default function FeatureGrid({
  items,
  dark = false,
  columns = 3,
}: {
  items: readonly Feature[];
  dark?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div
      className={`grid grid-cols-1 ${cols} gap-x-10 gap-y-2 ${dark ? "on-dark" : ""}`}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className={`reveal py-7 border-t ${dark ? "border-white/10" : "border-line"}`}
        >
          <span className="icon-disc">
            <item.icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <h3
            className={`mt-5 text-[17px] font-semibold tracking-[-0.01em] ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-2 text-[15px] leading-relaxed ${
              dark ? "text-white/60" : "text-muted"
            }`}
          >
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}
