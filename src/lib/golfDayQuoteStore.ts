"use client";

import { useSyncExternalStore } from "react";

export type GolfDayQuote = {
  prize: string;
  pricePerPlayer: number;
  golfers: number;
  promoters: number;
  addOns: { title: string; amount: number }[];
  prizeCost: number;
  promoterCost: number;
  addOnCost: number;
  total: number;
};

let state: GolfDayQuote | null = null;
const listeners = new Set<() => void>();

export function setGolfDayQuote(next: GolfDayQuote) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): GolfDayQuote | null {
  return state;
}

export function useGolfDayQuote(): GolfDayQuote | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
}

export function formatGolfDayQuoteMessage(q: GolfDayQuote): string {
  const lines: string[] = [];
  lines.push("I'd like to book the Get Lucky Hole-in-One Challenge for our golf day. Here's what I've put together:");
  lines.push("");
  lines.push(`• Prize: ${q.prize} (${formatRand(q.pricePerPlayer)}/player)`);
  lines.push(`• Players: ${q.golfers} — ${formatRand(q.prizeCost)}`);
  lines.push(`• Promoters: ${q.promoters} — ${formatRand(q.promoterCost)}`);
  if (q.addOns.length) {
    for (const a of q.addOns) {
      lines.push(`• ${a.title} — ${formatRand(a.amount)}`);
    }
  }
  lines.push("");
  lines.push(`Estimated total: ${formatRand(q.total)}`);
  lines.push("");
  lines.push("Please confirm availability and any next steps.");
  return lines.join("\n");
}
