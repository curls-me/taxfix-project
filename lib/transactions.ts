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

type Amounts = Pick<Transaction, "net" | "vatRate" | "vatOverride" | "grossOverride">;

export const vatAmount = (t: Amounts) =>
  t.vatOverride ?? Math.round(t.net * t.vatRate) / 100;
export const gross = (t: Amounts) =>
  t.grossOverride ??
  (t.vatOverride != null
    ? Math.round((t.net + t.vatOverride) * 100) / 100
    : Math.round(t.net * (100 + t.vatRate)) / 100);

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
