"use client";

import { useSyncExternalStore } from "react";

export type TourQuote = {
  entriesPerTour: number; // R100 entries sold per tour
  toursPerYear: number; // tours the operator runs per year
  revenuePerTour: number; // gross entry sales per tour
  operatorSharePerTour: number; // 20% commission earned by the operator per tour
  operatorSharePerYear: number; // operator commission across all tours
};

let state: TourQuote | null = null;
const listeners = new Set<() => void>();

export function setTourQuote(next: TourQuote) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): TourQuote | null {
  return state;
}

export function useTourQuote(): TourQuote | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
}

export function formatTourQuoteMessage(q: TourQuote): string {
  const lines: string[] = [];
  lines.push(
    "We'd like to offer the Get Lucky R100,000 Hole-in-One Challenge on our golf tours. Here's what we're planning:",
  );
  lines.push("");
  lines.push(`• Entries per tour: ${q.entriesPerTour} at R100 each (R100,000 prize on offer)`);
  lines.push(`• Tours per year: ${q.toursPerYear}`);
  lines.push(`• Estimated entry sales per tour: ${formatRand(q.revenuePerTour)}`);
  lines.push(`• Our commission per tour (20%): ${formatRand(q.operatorSharePerTour)}`);
  lines.push(`• Our commission per year: ${formatRand(q.operatorSharePerYear)}`);
  lines.push("");
  lines.push("Please confirm how we get set up and the next steps.");
  return lines.join("\n");
}
