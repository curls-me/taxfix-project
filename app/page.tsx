"use client";

import Link from "next/link";
import { eur, gross, useTransactions } from "@/lib/transactions";
import { resultText, vatReturn } from "@/lib/vat";
import { useProfile } from "@/lib/profile";
import { useFilings } from "@/lib/filings";

const PERIOD = "2026-10"; // demo constant so the dashboard looks the same on every test day
const YEAR = "2026";
const btn = "rounded-lg bg-forest px-5 py-2 font-semibold text-white";
const tile = "block rounded-xl bg-bar p-5 hover:ring-2 hover:ring-forest";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Page() {
  const { ready, all } = useTransactions();
  const { ready: pReady, complete } = useProfile();
  const { filings } = useFilings();
  if (!ready || !pReady) return null;

  // Tiles use every row, exactly like the lists (which do not filter by year).
  const incRows = all.filter((t) => t.type === "income");
  const expRows = all.filter((t) => t.type === "expense");
  const sumGross = (rows: typeof all) => rows.reduce((s, t) => s + gross(t), 0);
  const vat = vatReturn(all, PERIOD);
  const submitted = !!filings[PERIOD];

  // Chart: gross by issue date, so bars add up to the tile totals.
  const months = MONTHS.map((m, i) => {
    const key = `${YEAR}-${String(i + 1).padStart(2, "0")}`;
    return {
      m,
      inc: sumGross(incRows.filter((t) => t.date.startsWith(key))),
      exp: sumGross(expRows.filter((t) => t.date.startsWith(key))),
    };
  });
  const max = Math.max(...months.flatMap((x) => [x.inc, x.exp]), 1);

  const deadline = (
    <section aria-label="Next VAT return" className="rounded-xl border border-bar p-5">
      <h2 className="font-bold">Next VAT return</h2>
      <p className="mt-1">October 2026 · due 10 Nov 2026 (demo date)</p>
      {submitted && <p className="mt-1 font-semibold text-forest">Submitted (demo)</p>}
      <Link href={`/filing/${PERIOD}`} className={`mt-3 inline-block ${complete ? btn : "font-semibold text-forest underline"}`}>
        Open VAT return
      </Link>
    </section>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/transactions/income/new" className={btn}>Add income</Link>
          <Link href="/transactions/expenses/new" className={btn}>Add expense</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {complete ? (
          <>
            {deadline}
            <p className="self-center md:text-right">
              <Link href="/account/profile?from=/" className="font-semibold text-forest underline">Profile</Link>
            </p>
          </>
        ) : (
          <>
            <section aria-label="To do" className="rounded-xl bg-amber-100 p-5 text-amber-900">
              <h2 className="font-bold">To do</h2>
              <p className="mt-1">Complete your profile to file your VAT return</p>
              <Link href="/account/profile?from=/" className={`mt-3 inline-block ${btn}`}>
                Complete your profile <span aria-hidden="true">→</span>
              </Link>
            </section>
            {deadline}
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/transactions/income" className={tile}>
          <span className="block text-sm text-muted">Income {YEAR}</span>
          <span className="mt-1 block break-words text-3xl font-bold">{eur(sumGross(incRows))}</span>
          <span className="mt-1 block text-sm text-muted">
            {incRows.length ? `${incRows.length} invoices, paid and unpaid · sum of the Income list` : "No invoices yet"}
          </span>
        </Link>
        <Link href="/transactions/expenses" className={tile}>
          <span className="block text-sm text-muted">Expenses {YEAR}</span>
          <span className="mt-1 block break-words text-3xl font-bold">{eur(sumGross(expRows))}</span>
          <span className="mt-1 block text-sm text-muted">
            {expRows.length ? `${expRows.length} expenses · sum of the Expenses list` : "No expenses yet"}
          </span>
        </Link>
        <Link href={`/filing/${PERIOD}`} className={tile}>
          <span className="block text-sm text-muted">VAT · October 2026</span>
          <span className="mt-1 block break-words text-3xl font-bold">{resultText(vat.result)}</span>
          <span className="mt-1 block text-sm">VAT owed {eur(vat.owed)} · VAT saved {eur(vat.saved)}</span>
          <span className="mt-1 block text-sm text-muted">Paid income and expenses of October (demo rule)</span>
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-bar p-5" aria-label="Income and expenses by month">
        <h2 className="font-bold">Income and expenses {YEAR}</h2>
        {all.length === 0 ? (
          <p className="mt-3 text-muted">No income or expenses yet. Add your first one to see the chart.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">
              <span className="font-semibold text-forest">■ Income</span> ·{" "}
              <span className="font-semibold text-ink">▨ Expenses</span> (gross, by invoice date)
            </p>
            <div className="mt-4 flex h-40 items-end gap-1 sm:gap-2" aria-hidden="true">
              {months.map((x) => (
                <div key={x.m} className="flex h-full flex-1 flex-col justify-end">
                  <div className="flex flex-1 items-end justify-center gap-0.5">
                    <div className="w-1/2 bg-forest" style={{ height: `${(x.inc / max) * 100}%` }} />
                    <div
                      className="w-1/2 border-2 border-ink bg-white"
                      style={{ height: `${(x.exp / max) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-center text-xs text-muted">{x.m}</div>
                </div>
              ))}
            </div>
            <table className="sr-only">
              <caption>Income and expenses by month, {YEAR}</caption>
              <thead><tr><th>Month</th><th>Income</th><th>Expenses</th></tr></thead>
              <tbody>
                {months.map((x) => (
                  <tr key={x.m}><td>{x.m}</td><td>{eur(x.inc)}</td><td>{eur(x.exp)}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  );
}
