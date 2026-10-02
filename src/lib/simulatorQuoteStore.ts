"use client";

import { useSyncExternalStore } from "react";

// The simulator offer is fixed: R149 for 3 shots at a R100,000 hole-in-one.
// The venue keeps 10% of every entry as revenue share.
export const SIMULATOR_ENTRY = 149;
export const SIMULATOR_PRIZE = "R100,000";
export const VENUE_SHARE = 0.1;

export type SimulatorQuote = {
  swings: number; // estimated swings per month
  totalRevenue: number; // gross entry sales per month
  venueShare: number; // 10% kept by the venue
};

let state: SimulatorQuote | null = null;
const listeners = new Set<() => void>();

export function setSimulatorQuote(next: SimulatorQuote) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): SimulatorQuote | null {
  return state;
}

export function useSimulatorQuote(): SimulatorQuote | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

// Comma grouping, as the calculators show it: "en-ZA" groups with a space
// in some browsers, so the prefilled message would disagree with the quote.
function formatRand(n: number): string {
  return "R" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatSimulatorQuoteMessage(q: SimulatorQuote): string {
  const lines: string[] = [];
  lines.push(
    "We'd like to add the Get Lucky Hole-in-One Challenge to our golf simulator. Here's what we're looking at:",
  );
  lines.push("");
  lines.push(`• Offer: R${SIMULATOR_ENTRY} for 3 shots at a ${SIMULATOR_PRIZE} hole-in-one`);
  lines.push(`• Estimated entries per month (3 shots each): ${q.swings}`);
  lines.push(`• Estimated monthly entry sales: ${formatRand(q.totalRevenue)}`);
  lines.push(`• Our 10% revenue share: ${formatRand(q.venueShare)} per month`);
  lines.push("");
  lines.push("Please confirm how it works and the next steps to set this up.");
  return lines.join("\n");
}
