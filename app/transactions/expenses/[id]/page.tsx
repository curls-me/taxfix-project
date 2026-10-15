"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Transaction, VatRate } from "@/data/mock";
import { eur, gross, useTransactions, vatAmount } from "@/lib/transactions";

const CATEGORIES = ["Software", "Rent", "Materials", "Travel", "Other"];
const RATES: VatRate[] = [19, 7, 0];

type Form = { description: string; date: string; net: string; vatRate: VatRate; category: string };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ready, all } = useTransactions();
  const t = all.find((x) => x.id === id && x.type === "expense");
  if (!ready) return null;
  if (!t)
    return (
      <div>
        <p>This expense was not found.</p>
        <Link href="/transactions/expenses" className="font-semibold text-forest underline">
          Back to expenses
        </Link>
      </div>
    );
  return <EditForm t={t} />;
}

function EditForm({ t }: { t: Transaction }) {
  const router = useRouter();
  const { edit, remove } = useTransactions();
  const [f, setF] = useState<Form>({
    description: t.description,
    date: t.date,
    net: String(t.net),
    vatRate: t.vatRate,
    category: t.category ?? "Other",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const netNum = Number(f.net.replace(",", "."));
  const netOk = f.net.trim() !== "" && Number.isFinite(netNum) && netNum > 0;
  const preview = netOk ? { net: netNum, vatRate: f.vatRate } : null;

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setF({ ...f, [k]: v });
    setSaved(false);
  }

  function save() {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!f.description.trim()) e.description = "Enter a description.";
    if (!f.date || Number.isNaN(Date.parse(f.date))) e.date = "Enter the date of the expense.";
    if (!netOk) e.net = "Enter an amount greater than 0.";
    setErrors(e);
    if (Object.keys(e).length) return;
    edit(t.id, {
      description: f.description.trim(),
      date: f.date,
      net: Math.round(netNum * 100) / 100,
      vatRate: f.vatRate,
      category: f.category,
      vatPeriod: f.date.slice(0, 7),
    });
    router.push("/transactions/expenses");
  }

  const field = "mt-2 w-full rounded-lg border border-muted px-3 py-2";
  const err = (k: keyof Form) =>
    errors[k] && <p role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors[k]}</p>;

  return (
    <div className="max-w-xl">
      <Link href="/transactions/expenses" className="text-sm font-semibold text-forest underline">
        ← Back to expenses
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Edit expense</h1>
      <p className="mt-1 text-muted">{t.counterparty}</p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="desc" className="font-semibold">Description</label>
          <input id="desc" className={field} value={f.description} onChange={(e) => set("description", e.target.value)} />
          {err("description")}
        </div>
        <div>
          <label htmlFor="date" className="font-semibold">Date</label>
          <input id="date" type="date" className={field} value={f.date} onChange={(e) => set("date", e.target.value)} />
          {err("date")}
        </div>
        <div>
          <label htmlFor="net" className="font-semibold">Net amount (EUR)</label>
          <input id="net" inputMode="decimal" className={field} value={f.net} onChange={(e) => set("net", e.target.value)} />
          {err("net")}
        </div>
        <div>
          <label htmlFor="rate" className="font-semibold">VAT rate</label>
          <select id="rate" className={field} value={f.vatRate} onChange={(e) => set("vatRate", Number(e.target.value) as VatRate)}>
            {RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cat" className="font-semibold">Category</label>
          <select id="cat" className={field} value={f.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-bar p-4">
        {preview
          ? <>VAT {eur(vatAmount(preview))} · Total <strong>{eur(gross(preview))}</strong></>
          : "VAT and total appear once the net amount is valid."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button onClick={save} className="rounded-lg bg-forest px-5 py-2 font-semibold text-white">Save changes</button>
        {saved && <span role="status">Saved.</span>}
        <button onClick={() => setConfirming(true)} className="ml-auto rounded-lg px-4 py-2 font-semibold text-red-700 underline">
          Delete expense
        </button>
      </div>

      {confirming && (
        <div role="alertdialog" aria-labelledby="del-title" aria-describedby="del-text" className="mt-6 rounded-xl border-2 border-red-700 p-5">
          <h2 id="del-title" className="font-bold">Delete “{t.description}” from {t.counterparty}?</h2>
          <p id="del-text" className="mt-1">Are you sure? This action cannot be undone</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => { remove(t.id); router.push("/transactions/expenses"); }}
              className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white"
            >
              Delete expense
            </button>
            <button onClick={() => setConfirming(false)} className="rounded-lg px-4 py-2 font-semibold underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
