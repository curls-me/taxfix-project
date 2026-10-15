"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Transaction, VatRate } from "@/data/mock";
import { eur, gross, periodLabel, useTransactions, vatAmount } from "@/lib/transactions";

const CATEGORIES = ["Software", "Rent", "Materials", "Travel", "Other"];
const RATES: VatRate[] = [19, 7, 0];
// shortcut: made-up reason list, real rules decide when 0% input VAT is valid
const ZERO_REASONS = [
  "Small-business scheme (no VAT charged)",
  "Foreign supplier (reverse charge)",
  "VAT-exempt item",
  "Other",
];

type F = {
  invoiceNumber: string; date: string; party: string; description: string; category: string;
  paymentDate: string; net: string; vatRate: VatRate; vat: string | null; gross: string | null;
  reason: string;
};
type Errors = Partial<Record<keyof F, string>>;

const num = (s: string) => Number(s.replace(",", "."));
const round = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number) => n.toFixed(2);

export default function TransactionForm({ type, t }: { type: "income" | "expense"; t?: Transaction }) {
  const router = useRouter();
  const { add, edit, remove } = useTransactions();
  const income = type === "income";
  const listHref = income ? "/transactions/income" : "/transactions/expenses";
  const [f, setF] = useState<F>({
    invoiceNumber: t?.invoiceNumber ?? "",
    date: t?.date ?? "",
    party: t?.counterparty ?? "",
    description: t?.description ?? "",
    category: t?.category ?? "",
    paymentDate: t?.paymentDate ?? "",
    net: t ? String(t.net) : "",
    vatRate: t?.vatRate ?? 19,
    vat: t?.vatOverride != null ? fmt(t.vatOverride) : null,
    gross: t?.grossOverride != null ? fmt(t.grossOverride) : null,
    reason: t?.zeroVatReason ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  const netNum = num(f.net);
  const netOk = f.net.trim() !== "" && Number.isFinite(netNum) && netNum > 0;
  const base = { net: netOk ? round(netNum) : 0, vatRate: f.vatRate };
  const calcVat = vatAmount(base);
  const vatNum = f.vat != null ? num(f.vat) : null;
  const vatShown = f.vat ?? fmt(calcVat);
  const calcGross = gross({ ...base, vatOverride: vatNum != null && Number.isFinite(vatNum) ? vatNum : null });
  const grossShown = f.gross ?? fmt(calcGross);

  // Changing net or rate restores the calculated VAT and gross.
  const setBase = (patch: Partial<F>) => setF({ ...f, ...patch, vat: null, gross: null });
  const set = (patch: Partial<F>) => setF({ ...f, ...patch });

  const periodDate = income ? f.paymentDate : f.date;
  const period = periodDate && !Number.isNaN(Date.parse(periodDate))
    ? `Counts toward ${periodLabel(periodDate.slice(0, 7))} (demo rule: the month of the ${income ? "payment" : "issue"} date)`
    : income ? "Not counted until paid" : "Choose an issue date to see the VAT period";

  function save() {
    if (saving) return;
    const e: Errors = {};
    if (income && !f.invoiceNumber.trim()) e.invoiceNumber = "Enter the invoice number.";
    if (!f.date || Number.isNaN(Date.parse(f.date))) e.date = "Enter the issue date.";
    if (!f.party.trim()) e.party = `Enter the ${income ? "client" : "supplier"}.`;
    if (!f.category) e.category = "Choose a category.";
    if (!netOk) e.net = "Net amount must be a number above 0, for example 120.00";
    if (f.vat != null && !(Number.isFinite(num(f.vat)) && num(f.vat) >= 0)) e.vat = "Enter a VAT amount of 0 or more.";
    if (f.gross != null && !(Number.isFinite(num(f.gross)) && num(f.gross) >= 0)) e.gross = "Enter a gross amount of 0 or more.";
    if (!income && f.vatRate === 0 && !f.reason) e.reason = "Choose why there is no VAT on this expense.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    const periodSource = income ? f.paymentDate || f.date : f.date;
    const data = {
      date: f.date,
      counterparty: f.party.trim(),
      description: f.description.trim(),
      net: round(netNum),
      vatRate: f.vatRate,
      vatPeriod: periodSource.slice(0, 7),
      category: income ? undefined : f.category,
      invoiceNumber: f.invoiceNumber.trim() || undefined,
      vatOverride: f.vat != null ? round(num(f.vat)) : null,
      grossOverride: f.gross != null ? round(num(f.gross)) : null,
      zeroVatReason: !income && f.vatRate === 0 ? f.reason : undefined,
      ...(income ? { paymentDate: f.paymentDate || undefined, status: f.paymentDate ? "paid" : "unpaid" } : {}),
    } as Partial<Transaction>;
    if (t) edit(t.id, data);
    else add({ id: `${income ? "inc" : "exp"}-${Date.now()}`, type, status: "paid", ...data } as Transaction);
    router.push(listHref);
  }

  const field = "mt-2 w-full rounded-lg border border-muted px-3 py-2";
  const label = "font-semibold";
  const err = (k: keyof F) =>
    errors[k] && <p id={`${k}-err`} role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors[k]}</p>;
  const a11y = (k: keyof F) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });
  const nErr = Object.keys(errors).length;
  const party = income ? "Client" : "Supplier";

  return (
    <div className="max-w-xl">
      <Link href={listHref} className="text-sm font-semibold text-forest underline">
        ← Back to {income ? "income" : "expenses"}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        {t ? "Edit expense" : income ? "Add income" : "Add expense"}
      </h1>

      <div className="mt-6 rounded-xl border-2 border-dashed border-muted p-5 text-center text-muted">
        Drop an invoice or receipt here. Demo: the file is not read or stored, so fill in the fields by hand.
      </div>

      {nErr > 0 && (
        <p role="alert" className="mt-6 font-semibold text-red-700">
          Please fix {nErr} {nErr === 1 ? "field" : "fields"} to save.
        </p>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="inv" className={label}>Invoice number{income ? "" : " (optional)"}</label>
          <input id="inv" className={field} value={f.invoiceNumber} onChange={(e) => set({ invoiceNumber: e.target.value })} {...a11y("invoiceNumber")} />
          {err("invoiceNumber")}
        </div>
        <div>
          <label htmlFor="date" className={label}>Issue date</label>
          <input id="date" type="date" className={field} value={f.date} onChange={(e) => set({ date: e.target.value })} {...a11y("date")} />
          {err("date")}
        </div>
        <div>
          <label htmlFor="party" className={label}>{party}</label>
          <input id="party" className={field} value={f.party} onChange={(e) => set({ party: e.target.value })} {...a11y("party")} />
          {err("party")}
        </div>
        <div>
          <label htmlFor="desc" className={label}>Description (optional)</label>
          <input id="desc" className={field} value={f.description} onChange={(e) => set({ description: e.target.value })} />
        </div>
        <div>
          <label htmlFor="cat" className={label}>Category</label>
          <select id="cat" className={field} value={f.category} onChange={(e) => set({ category: e.target.value })} {...a11y("category")}>
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {err("category")}
        </div>
        {income && (
          <div>
            <label htmlFor="paid" className={label}>Payment date (optional)</label>
            <input id="paid" type="date" className={field} value={f.paymentDate} onChange={(e) => set({ paymentDate: e.target.value })} />
          </div>
        )}
        <div>
          <label htmlFor="net" className={label}>Net amount, before VAT (EUR)</label>
          <input id="net" inputMode="decimal" className={field} value={f.net} onChange={(e) => setBase({ net: e.target.value })} {...a11y("net")} />
          {err("net")}
        </div>
        <div>
          <label htmlFor="rate" className={label}>VAT rate</label>
          <select id="rate" className={field} value={f.vatRate} onChange={(e) => setBase({ vatRate: Number(e.target.value) as VatRate })}>
            {RATES.map((r) => <option key={r} value={r}>{r}%{r === 19 ? " (standard)" : r === 7 ? " (reduced)" : ""}</option>)}
          </select>
        </div>
        {!income && f.vatRate === 0 && (
          <div>
            <label htmlFor="reason" className={label}>Why is there no VAT?</label>
            <p className="text-sm text-muted">Without VAT on the invoice, there is no VAT to claim back for this expense.</p>
            <select id="reason" className={field} value={f.reason} onChange={(e) => set({ reason: e.target.value })} {...a11y("reason")}>
              <option value="">Choose a reason</option>
              {ZERO_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
            {err("reason")}
          </div>
        )}
        <div>
          <label htmlFor="vat" className={label}>VAT amount (EUR)</label>
          <input id="vat" inputMode="decimal" className={field} value={vatShown} onChange={(e) => set({ vat: e.target.value })} {...a11y("vat")} />
          {f.vat != null ? (
            <p className="mt-1 text-sm">
              <span className="font-semibold">edited</span> ·{" "}
              <button type="button" onClick={() => set({ vat: null })} className="underline">Reset to calculated</button>
            </p>
          ) : <p className="mt-1 text-sm text-muted">Calculated from net and rate. You can overwrite it.</p>}
          {err("vat")}
        </div>
        <div>
          <label htmlFor="gross" className={label}>Gross amount (EUR)</label>
          <input id="gross" inputMode="decimal" className={field} value={grossShown} onChange={(e) => set({ gross: e.target.value })} {...a11y("gross")} />
          {f.gross != null ? (
            <p className="mt-1 text-sm">
              <span className="font-semibold">edited</span> ·{" "}
              <button type="button" onClick={() => set({ gross: null })} className="underline">Reset to calculated</button>
            </p>
          ) : <p className="mt-1 text-sm text-muted">Net plus VAT. You can overwrite it.</p>}
          {err("gross")}
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-bar p-4">{period}</p>
      {/* shortcut: period is the calendar month, real filing periods come with TFX-06 */}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button onClick={save} disabled={saving} className="rounded-lg bg-forest px-5 py-2 font-semibold text-white">
          {t ? "Save changes" : "Save"}
        </button>
        <Link href={listHref} className="font-semibold underline">Cancel</Link>
        {t && (
          <button onClick={() => setConfirming(true)} className="ml-auto rounded-lg px-4 py-2 font-semibold text-red-700 underline">
            Delete expense
          </button>
        )}
      </div>

      {t && confirming && (
        <div role="alertdialog" aria-labelledby="del-title" aria-describedby="del-text" className="mt-6 rounded-xl border-2 border-red-700 p-5">
          <h2 id="del-title" className="font-bold">Delete “{t.description || t.counterparty}” from {t.counterparty}?</h2>
          <p id="del-text" className="mt-1">Are you sure? This action cannot be undone</p>
          <div className="mt-4 flex gap-3">
            <button onClick={() => { remove(t.id); router.push(listHref); }} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white">
              Delete expense
            </button>
            <button onClick={() => setConfirming(false)} className="rounded-lg px-4 py-2 font-semibold underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
