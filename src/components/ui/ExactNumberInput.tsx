"use client";

import { useState } from "react";

/**
 * The exact-number box beside each calculator slider. While someone types it
 * holds their draft, so clearing the box to type "20" no longer snaps it to 1
 * and turns the entry into "120". Every valid number still updates the
 * calculator as they type, and the box settles on the clamped value when it
 * loses focus.
 */
export default function ExactNumberInput({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));

  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={draft ?? value}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const n = Number(raw);
        if (raw !== "" && Number.isFinite(n)) onChange(clamp(n));
      }}
      onBlur={() => setDraft(null)}
      className="w-20 text-center rounded-lg border border-green/15 px-3 py-2 font-semibold text-green focus:border-green focus:outline-none"
      aria-label={label}
    />
  );
}
