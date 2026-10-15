"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { eur, formatDate, periodLabel, useTransactions, vatAmount } from "@/lib/transactions";
import { isValidPeriod, resultText, vatReturn } from "@/lib/vat";
import { useProfile } from "@/lib/profile";
import { submitFiling, useFilings } from "@/lib/filings";
import type { Transaction } from "@/data/mock";

function windowLabel(period: string) {
  const [y, m] = period.split("-").map(Number);
  // shortcut: made-up filing window (1-10 of next month), real deadlines depend on the filing rules
  return `1–10 ${new Date(y, m, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
}

export default function Page({ params }: { params: Promise<{ period: string }> }) {
  const { period } = use(params);
  const router = useRouter();
  const { ready, all } = useTransactions();
  const { ready: pReady, complete } = useProfile();
  const { ready: fReady, filings } = useFilings();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isValidPeriod(period))
    return (
      <div>
        <p className="text-lg">This period doesn&apos;t exist.</p>
        <Link href="/" className="font-semibold text-forest underline">Back to Dashboard</Link>
      </div>
    );
  if (!ready || !pReady || !fReady) return null;

  const label = periodLabel(period);
  const r = vatReturn(all, period);
  const unpaid = all.filter((t) => t.type === "income" && t.status === "unpaid" && t.date.startsWith(period)).length;
  const submitted = filings[period];
  const blocker = !complete ? "Complete your profile first" : r.isEmpty ? `Nothing to file for ${label} yet` : "";
  const dash = "–";

  function submit() {
    if (busy) return;
    setBusy(true);
    if (submitFiling(period, r.result)) router.push(`/filing/${period}/done`);
    else {
      setFailed(true);
      setBusy(false);
    }
  }

  const row = (t: Transaction, counted: string) => (
    <li key={t.id}>
      <Link
        href={`/transactions/${t.type === "income" ? "income" : "expenses"}/${t.id}`}
        className="flex items-start justify-between gap-4 px-4 py-3 hover:bg-bar"
      >
        <span className="min-w-0">
          <span className="block break-words font-medium">{t.counterparty}</span>
          <span className="block text-sm text-muted">{counted}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block font-semibold tabular-nums">{eur(vatAmount(t))}</span>
          <span className="block text-sm text-muted">VAT {t.vatRate}%</span>
        </span>
      </Link>
    </li>
  );

  const list = (title: string, rows: Transaction[], counted: (t: Transaction) => string) => (
    <section className="mt-8" aria-label={title}>
      <h2 className="text-xl font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-muted">None in {label}.</p>
      ) : (
        <ul className="mt-3 divide-y divide-bar rounded-xl border border-bar">
          {rows.map((t) => row(t, counted(t)))}
        </ul>
      )}
    </section>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">VAT return, {label}</h1>
      <p className="mt-2">Filing window: {windowLabel(period)} (demo date)</p>
      <p className="mt-1 text-sm text-muted">
        Income counts in the month it was paid. Unpaid invoices are not counted until paid. Expenses count in the
        month of their invoice date (demo simplification).
      </p>
      {unpaid > 0 && (
        <p className="mt-1 text-sm">
          {unpaid} unpaid {unpaid === 1 ? "invoice" : "invoices"} not counted yet.{" "}
          <Link href="/transactions/income" className="font-semibold text-forest underline">See income</Link>
        </p>
      )}

      {!complete && (
        <div className="mt-6 rounded-xl bg-amber-100 p-4 text-amber-900">
          <p className="font-semibold">Complete your profile to file this return.</p>
          <Link href={`/account/profile?from=/filing/${period}`} className="mt-1 inline-block font-semibold underline">
            Complete profile
          </Link>
        </div>
      )}

      <section className="mt-6 rounded-xl bg-bar p-6" aria-label="Figures">
        <p className="text-sm text-muted">Result</p>
        <p className="mt-1 text-4xl font-bold">{r.isEmpty ? dash : resultText(r.result)}</p>
        {r.isEmpty ? (
          <p className="mt-3">
            No paid income or expenses in {label}. Add one, or add a payment date to an invoice.{" "}
            <Link href="/transactions/income/new" className="font-semibold text-forest underline">Add income</Link>{" · "}
            <Link href="/transactions/expenses/new" className="font-semibold text-forest underline">Add expense</Link>
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">{eur(r.owed)} owed − {eur(r.saved)} saved</p>
        )}
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted">VAT owed (on income)</dt>
            <dd className="font-semibold tabular-nums">{r.isEmpty ? dash : eur(r.owed)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">VAT saved (on expenses)</dt>
            <dd className="font-semibold tabular-nums">{r.isEmpty ? dash : eur(r.saved)}</dd>
          </div>
        </dl>
      </section>

      {list("Income", r.income, (t) => `${t.description} · paid ${formatDate(t.paymentDate!)}`)}
      {list("Expenses", r.expenses, (t) => `${t.description} · invoice ${formatDate(t.date)}`)}

      <div className="mt-8">
        {submitted && (
          <p className="mb-3 font-semibold text-forest">
            Submitted (demo) on {formatDate(submitted.submittedAt.slice(0, 10))}
          </p>
        )}
        <button
          onClick={submit}
          disabled={!!blocker || busy}
          aria-describedby={blocker ? "blocker" : undefined}
          className="rounded-lg bg-forest px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitted ? "Resubmit" : "Continue"}
        </button>
        {blocker && <p id="blocker" className="mt-2 text-sm">{blocker}</p>}
        {failed && <p role="alert" className="mt-2 font-semibold text-red-700">Couldn&apos;t save in this browser.</p>}
      </div>
    </div>
  );
}
