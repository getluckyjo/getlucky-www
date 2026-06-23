"use client";

import { useSyncExternalStore } from "react";

export type CharityQuote = {
  swing: string; // entry price label, e.g. "R150"
  entryAmount: number; // price per swing in Rand
  prize: string; // prize on offer, e.g. "R100,000"
  swings: number; // estimated swings sold
  totalRaised: number; // gross swing sales
  charityShare: number; // 50% kept by the charity
};

let state: CharityQuote | null = null;
const listeners = new Set<() => void>();

export function setCharityQuote(next: CharityQuote) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): CharityQuote | null {
  return state;
}

export function useCharityQuote(): CharityQuote | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
}

export function formatCharityQuoteMessage(q: CharityQuote): string {
  const lines: string[] = [];
  lines.push(
    "We'd like to host a Get Lucky charity golf day with the Hole-in-One Challenge. Here's what we're planning:",
  );
  lines.push("");
  lines.push(`• Swing price: ${q.swing} per golfer (${q.prize} prize on offer)`);
  lines.push(`• Estimated swings sold: ${q.swings}`);
  lines.push(`• Estimated swing sales: ${formatRand(q.totalRaised)}`);
  lines.push(`• Estimated raised for our charity (50%): ${formatRand(q.charityShare)}`);
  lines.push("");
  lines.push("Please confirm availability and the next steps to set this up.");
  return lines.join("\n");
}
