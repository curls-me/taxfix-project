"use client";

import { use, useState } from "react";
import Link from "next/link";
import { user } from "@/data/mock";
import { eur, formatDate, gross, periodLabel, useTransactions, vatAmount } from "@/lib/transactions";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ready, all, edit } = useTransactions();
  const t = all.find((x) => x.id === id && x.type === "income");
  const [date, setDate] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!ready) return null;
  if (!t)
    return (
      <div>
        <p>This income item was not found.</p>
        <Link href="/transactions/income" className="font-semibold text-forest underline">
          Back to income
        </Link>
      </div>
    );

  const value = date ?? t.paymentDate ?? "";
  const outside = value !== "" && !value.startsWith(`${user.taxYear}-`);

  function save() {
    if (!value || Number.isNaN(Date.parse(value))) {
      setError("Enter the date this was paid.");
      setSaved(false);
      return;
    }
    setError("");
    edit(id, { paymentDate: value, status: "paid", vatPeriod: value.slice(0, 7) });
    setSaved(true);
  }

  return (
    <div className="max-w-xl">
      <Link href="/transactions/income" className="text-sm font-semibold text-forest underline">
        ← Back to income
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{t.counterparty}</h1>
      <p className="mt-1 text-muted">
        {t.description} · invoiced {formatDate(t.date)}
      </p>

      <dl className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-bar p-6">
        <div><dt className="text-sm text-muted">Net</dt><dd className="font-semibold tabular-nums">{eur(t.net)}</dd></div>
        <div><dt className="text-sm text-muted">VAT {t.vatRate}%</dt><dd className="font-semibold tabular-nums">{eur(vatAmount(t))}</dd></div>
        <div><dt className="text-sm text-muted">Total</dt><dd className="font-semibold tabular-nums">{eur(gross(t))}</dd></div>
      </dl>

      <div className="mt-8">
        <label htmlFor="paid" className="block font-semibold">Paid on</label>
        <input
          id="paid"
          type="date"
          value={value}
          onChange={(e) => { setDate(e.target.value); setSaved(false); }}
          aria-describedby="paid-help"
          aria-invalid={error ? true : undefined}
          className="mt-2 rounded-lg border border-muted px-3 py-2"
        />
        <p id="paid-help" className="mt-2 text-sm text-muted">
          The payment date decides which VAT period this income counts toward.
        </p>
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
        {outside && (
          <p className="mt-2 text-sm text-forest">This date is outside {user.taxYear}.</p>
        )}
        {value && !error && (
          <p className="mt-2">
            Counts toward <strong>{periodLabel(value.slice(0, 7))}</strong>
            <span className="text-sm text-muted"> (demo rule: the month of the payment date)</span>
          </p>
        )}
        <button onClick={save} className="mt-4 rounded-lg bg-forest px-5 py-2 font-semibold text-white">
          Save payment date
        </button>
        {saved && <p role="status" className="mt-2 text-sm font-semibold text-forest">Saved.</p>}
      </div>
    </div>
  );
}
