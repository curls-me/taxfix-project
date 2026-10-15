"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Transaction, VatRate } from "@/data/mock";
import { useProfile } from "@/lib/profile";
import { TERMS, dueDate, eur, formatDate, useTransactions } from "@/lib/transactions";

const DRAFT_KEY = "vat-companion.invoice-draft.v1";
const RATES: { rate: VatRate; label: string }[] = [
  { rate: 19, label: "19% (standard)" },
  { rate: 7, label: "7% (reduced)" },
  { rate: 0, label: "0%" },
];
const MAX_LINES = 10;

type Line = { description: string; net: string; vatRate: VatRate };
type F = {
  number: string; issue: string; service: string; client: string; address: string;
  lines: Line[]; terms: string; notes: string;
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const num = (s: string) => Number(s.replace(",", "."));
const round = (n: number) => Math.round(n * 100) / 100;
const emptyLine = (): Line => ({ description: "", net: "", vatRate: 19 });

export default function Page() {
  const router = useRouter();
  const { ready, all, add } = useTransactions();
  const { profile, ready: profileReady, complete } = useProfile();
  const [f, setF] = useState<F | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [storageFailed, setStorageFailed] = useState(false);

  // Start from the saved draft (Profile round trip) or fresh defaults.
  useEffect(() => {
    if (!ready || f) return;
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) { setF(JSON.parse(raw)); return; }
    } catch {
      // unreadable draft: start fresh
    }
    const year = new Date().getFullYear();
    const used = all.filter((t) => t.invoiceNumber?.startsWith(`${year}-`)).map((t) => Number(t.invoiceNumber!.slice(5)) || 0);
    const next = `${year}-${String(Math.max(0, ...used) + 1).padStart(3, "0")}`;
    setF({ number: next, issue: today(), service: today(), client: "", address: "", lines: [emptyLine()], terms: "14 days", notes: "" });
  }, [ready, f, all]);

  useEffect(() => {
    if (!f) return;
    try { window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(f)); } catch { /* draft not kept */ }
  }, [f]);

  if (!f || !profileReady) return null;
  const set = (patch: Partial<F>) => setF({ ...f, ...patch });
  const setLine = (i: number, patch: Partial<Line>) =>
    set({ lines: f.lines.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  const clearDraft = () => { try { window.sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } };

  const parsed = f.lines.map((l) => ({ ...l, n: Number.isFinite(num(l.net)) && l.net.trim() !== "" ? round(num(l.net)) : 0 }));
  const net = round(parsed.reduce((s, l) => s + l.n, 0));
  const vatByRate = RATES.map(({ rate }) => {
    const base = round(parsed.filter((l) => l.vatRate === rate).reduce((s, l) => s + l.n, 0));
    const vat = parsed.filter((l) => l.vatRate === rate).reduce((s, l) => s + Math.round(l.n * rate) / 100, 0);
    return { rate, base, vat, used: parsed.some((l) => l.vatRate === rate) };
  }).filter((r) => r.used);
  const vat = round(vatByRate.reduce((s, r) => s + r.vat, 0));
  const due = f.issue && !Number.isNaN(Date.parse(f.issue)) ? dueDate(f.issue, f.terms) : "";

  function save() {
    const e: string[] = [];
    const number = f!.number.trim();
    if (!number) e.push("Enter the invoice number.");
    else if (all.some((t) => t.type === "income" && t.invoiceNumber === number))
      e.push(`Invoice number ${number} is already used. Choose another.`);
    if (!f!.issue || Number.isNaN(Date.parse(f!.issue))) e.push("Enter the issue date.");
    if (!f!.service || Number.isNaN(Date.parse(f!.service))) e.push("Enter the service date.");
    if (!f!.client.trim()) e.push("Enter the client name.");
    parsed.forEach((l, i) => {
      if (!l.description.trim()) e.push(`Add a description for line ${i + 1}.`);
      if (!(l.n > 0)) e.push(`Net amount for line ${i + 1} must be a number above 0, for example 120.00`);
    });
    setErrors(e);
    if (e.length) return;
    const rates = parsed.map((l) => l.vatRate);
    const t: Transaction = {
      id: `inc-${Date.now()}`,
      type: "income",
      date: f!.issue,
      counterparty: f!.client.trim(),
      description: parsed[0].description.trim() + (parsed.length > 1 ? ` + ${parsed.length - 1} more` : ""),
      net,
      vatRate: rates.every((r) => r === rates[0]) ? rates[0] : (Math.max(...rates) as VatRate),
      status: "unpaid",
      vatPeriod: f!.issue.slice(0, 7), // reset to the payment month on Income detail
      invoiceNumber: number,
      lines: parsed.map((l) => ({ description: l.description.trim(), net: l.n, vatRate: l.vatRate })),
      serviceDate: f!.service,
      clientAddress: f!.address.trim() || undefined,
      paymentTerms: f!.terms,
      notes: f!.notes.trim() || undefined,
    };
    add(t);
    // add() swallows storage errors; confirm the write landed before leaving.
    try {
      const saved = JSON.parse(window.localStorage.getItem("vat-companion.transactions.v1") ?? "{}");
      if (!saved.added?.some((x: Transaction) => x.id === t.id)) throw new Error("not saved");
    } catch {
      setStorageFailed(true);
      return;
    }
    clearDraft();
    router.push("/transactions/income?created=1");
  }

  const field = "mt-2 w-full rounded-lg border border-muted px-3 py-2";
  const addr = [profile.street, `${profile.postcode} ${profile.city}`.trim()].filter((s) => s.trim());

  return (
    <div className="max-w-2xl">
      <Link href="/transactions/income" onClick={clearDraft} className="text-sm font-semibold text-forest underline">
        ← Back to income
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Create invoice</h1>

      {errors.length > 0 && (
        <div role="alert" className="mt-6 font-semibold text-red-700">
          <p>Please fix {errors.length} {errors.length === 1 ? "thing" : "things"} to create the invoice:</p>
          <ul className="mt-1 list-disc pl-5 font-normal">{errors.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      )}
      {storageFailed && (
        <p role="alert" className="mt-6 font-semibold text-red-700">
          Couldn&apos;t save in this browser. Your entries are still here.
        </p>
      )}

      <section className="mt-6 rounded-xl bg-bar p-5" aria-label="From">
        <h2 className="text-sm text-muted">From</h2>
        {complete ? (
          <p className="mt-1">
            <strong>{profile.name}</strong><br />
            {addr.map((l) => <span key={l}>{l}<br /></span>)}
            Tax number {profile.taxNumber}
          </p>
        ) : (
          <div className="mt-1">
            <p className="font-semibold">Your profile is incomplete, so the sender block is missing details. You can still create the invoice.</p>
            <Link href="/account/profile?from=/transactions/income/invoice" className="mt-2 inline-block font-semibold text-forest underline">
              Complete your profile →
            </Link>
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="number" className="font-semibold">Invoice number</label>
          <input id="number" className={field} value={f.number} onChange={(e) => set({ number: e.target.value })} />
        </div>
        <div>
          <label htmlFor="issue" className="font-semibold">Issue date</label>
          <input id="issue" type="date" className={field} value={f.issue} onChange={(e) => set({ issue: e.target.value, service: f.service === f.issue ? e.target.value : f.service })} />
        </div>
        <div>
          <label htmlFor="service" className="font-semibold">Service date</label>
          <input id="service" type="date" className={field} value={f.service} onChange={(e) => set({ service: e.target.value })} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="client" className="font-semibold">Client name</label>
          <input id="client" className={field} value={f.client} onChange={(e) => set({ client: e.target.value })} />
        </div>
        <div>
          <label htmlFor="address" className="font-semibold">Client address (optional)</label>
          <textarea id="address" rows={2} className={field} value={f.address} onChange={(e) => set({ address: e.target.value })} />
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold">Line items</h2>
      <ul className="mt-3 space-y-4">
        {f.lines.map((l, i) => (
          <li key={i} className="rounded-xl border border-bar p-4">
            <label htmlFor={`d${i}`} className="font-semibold">Description, line {i + 1}</label>
            <input id={`d${i}`} className={field} value={l.description} onChange={(e) => setLine(i, { description: e.target.value })} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={`n${i}`} className="font-semibold">Net amount, before VAT (line {i + 1})</label>
                <input id={`n${i}`} inputMode="decimal" className={field} value={l.net} onChange={(e) => setLine(i, { net: e.target.value })} />
              </div>
              <div>
                <label htmlFor={`r${i}`} className="font-semibold">VAT rate (line {i + 1})</label>
                <select id={`r${i}`} className={field} value={l.vatRate} onChange={(e) => setLine(i, { vatRate: Number(e.target.value) as VatRate })}>
                  {RATES.map((r) => <option key={r.rate} value={r.rate}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <button
              type="button"
              disabled={f.lines.length === 1}
              onClick={() => set({ lines: f.lines.filter((_, j) => j !== i) })}
              className="mt-3 text-sm font-semibold text-forest underline disabled:text-muted disabled:no-underline"
            >
              Remove line {i + 1}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={f.lines.length >= MAX_LINES}
        onClick={() => set({ lines: [...f.lines, emptyLine()] })}
        className="mt-4 rounded-lg border border-forest px-4 py-2 font-semibold text-forest disabled:border-muted disabled:text-muted"
      >
        Add line
      </button>
      {f.lines.length >= MAX_LINES && <p className="mt-2 text-sm text-muted">Up to 10 lines in this demo</p>}

      <dl className="mt-6 space-y-2 rounded-xl bg-bar p-6" aria-label="Totals">
        <div className="flex justify-between"><dt>Net</dt><dd className="font-semibold tabular-nums">{eur(net)}</dd></div>
        {vatByRate.length === 0 ? (
          <div className="flex justify-between"><dt>VAT</dt><dd className="font-semibold tabular-nums">{eur(0)}</dd></div>
        ) : (
          vatByRate.map((r) => (
            <div key={r.rate} className="flex justify-between">
              <dt>VAT {r.rate}%{vatByRate.length > 1 ? ` on ${eur(r.base)}` : ""}</dt>
              <dd className="font-semibold tabular-nums">{eur(round(r.vat))}</dd>
            </div>
          ))
        )}
        <div className="flex justify-between border-t border-muted pt-2 text-lg"><dt>Total</dt><dd className="font-bold tabular-nums">{eur(round(net + vat))}</dd></div>
      </dl>

      <div className="mt-6">
        <label htmlFor="terms" className="font-semibold">Payment terms</label>
        <select id="terms" className={field} value={f.terms} onChange={(e) => set({ terms: e.target.value })}>
          {TERMS.map((t) => <option key={t.label}>{t.label}</option>)}
        </select>
        {due && <p className="mt-2">Due {formatDate(due)}</p>}
      </div>

      <div className="mt-5">
        <label htmlFor="notes" className="font-semibold">Notes (optional)</label>
        <textarea id="notes" rows={3} className={field} value={f.notes} onChange={(e) => set({ notes: e.target.value })} />
      </div>

      <p className="mt-6 text-muted">Not counted until paid. Set a payment date on the income item to count it in a VAT return.</p>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} className="rounded-lg bg-forest px-5 py-2 font-semibold text-white">Create invoice</button>
        <Link href="/transactions/income" onClick={clearDraft} className="font-semibold text-forest underline">Cancel</Link>
      </div>
    </div>
  );
}
