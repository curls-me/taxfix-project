"use client";

import { useEffect, useState } from "react";

export type Filings = Record<string, { submittedAt: string; result: number }>;

const KEY = "vat-companion.filings.v1";

export function readFilings(): Filings {
  try {
    const raw = window.localStorage.getItem(KEY);
    const f = raw ? JSON.parse(raw) : {};
    return f && typeof f === "object" && !Array.isArray(f) ? f : {};
  } catch {
    return {};
  }
}

export function submitFiling(period: string, result: number): boolean {
  try {
    const next = { ...readFilings(), [period]: { submittedAt: new Date().toISOString(), result } };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function useFilings() {
  const [filings, setFilings] = useState<Filings>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setFilings(readFilings());
    setReady(true);
  }, []);
  return { ready, filings };
}
