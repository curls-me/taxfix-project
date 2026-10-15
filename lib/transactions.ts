"use client";

import { useCallback, useEffect, useState } from "react";
import { transactions as mock, type Transaction } from "@/data/mock";

// Browser-only store: tester edits and deletions layered over the mock data.
type Stored = {
  added: Transaction[];
  edits: Record<string, Partial<Transaction>>;
  deleted: string[];
};

const KEY = "vat-companion.transactions.v1";
const empty: Stored = { added: [], edits: {}, deleted: [] };

function read(): Stored {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

function write(s: Stored) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // storage unavailable: changes last until reload
  }
}

export function useTransactions() {
  const [stored, setStored] = useState<Stored>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStored(read());
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: Stored) => Stored) => {
    const next = fn(read());
    write(next);
    setStored(next);
  }, []);

  const all: Transaction[] = [...mock, ...stored.added]
    .filter((t) => !stored.deleted.includes(t.id))
    .map((t) => ({ ...t, ...stored.edits[t.id] }));

  return {
    ready,
    all,
    add: (t: Transaction) => update((s) => ({ ...s, added: [...s.added, t] })),
    edit: (id: string, patch: Partial<Transaction>) =>
      update((s) => ({ ...s, edits: { ...s.edits, [id]: { ...s.edits[id], ...patch } } })),
    remove: (id: string) => update((s) => ({ ...s, deleted: [...s.deleted, id] })),
  };
}

type Amounts = Pick<Transaction, "net" | "vatRate" | "vatOverride" | "grossOverride" | "lines">;

// Invoices with lines: VAT is the sum of each line's VAT, rounded per line.
export const vatAmount = (t: Amounts) =>
  t.vatOverride ??
  (t.lines
    ? t.lines.reduce((sum, l) => sum + Math.round(l.net * l.vatRate) / 100, 0)
    : Math.round(t.net * t.vatRate) / 100);
export const gross = (t: Amounts) =>
  t.grossOverride ??
  (t.vatOverride != null || t.lines
    ? Math.round((t.net + vatAmount(t)) * 100) / 100
    : Math.round(t.net * (100 + t.vatRate)) / 100);

// "Mixed" when an invoice's lines have different rates.
export const rateLabel = (t: Pick<Transaction, "vatRate" | "lines">) =>
  t.lines?.some((l) => l.vatRate !== t.lines![0].vatRate) ? "Mixed" : `${t.vatRate}%`;

export const eur = (n: number) =>
  new Intl.NumberFormat("en-DE", { style: "currency", currency: "EUR" }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const periodLabel = (ym: string) =>
  new Date(ym + "-01T00:00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export const TERMS = [
  { label: "Due on receipt", days: 0 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
];

export function dueDate(issue: string, terms: string) {
  const d = new Date(issue + "T00:00:00");
  d.setDate(d.getDate() + (TERMS.find((x) => x.label === terms)?.days ?? 0));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
