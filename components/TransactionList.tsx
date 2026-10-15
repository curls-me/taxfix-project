"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { user } from "@/data/mock";
import { eur, formatDate, gross, useTransactions } from "@/lib/transactions";

const TABS = [
  { label: "Income", href: "/transactions/income" },
  { label: "Expenses", href: "/transactions/expenses" },
];

export default function TransactionList({ type }: { type: "income" | "expense" }) {
  const pathname = usePathname();
  const { ready, all } = useTransactions();
  const isIncome = type === "income";
  const rows = all
    .filter((t) => t.type === type)
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = rows.reduce((sum, t) => sum + gross(t), 0);

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Transactions</h1>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Transactions" className="flex gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={pathname === tab.href ? "page" : undefined}
            className={`rounded-lg px-4 py-2 font-medium ${
              pathname === tab.href ? "bg-lime-soft font-semibold text-forest" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Link
        href={isIncome ? "/transactions/income/new" : "/transactions/expenses/new"}
        className="rounded-lg bg-forest px-5 py-2 font-semibold text-white"
      >
        {isIncome ? "Add income" : "Add expense"}
      </Link>
      </div>

      {!ready ? null : rows.length === 0 ? (
        <div className="mt-8 rounded-xl bg-bar p-6">
          <p className="text-lg">
            {isIncome ? `No income yet for ${user.taxYear}.` : `No expenses yet for ${user.taxYear}.`}
          </p>
          <Link
            href={isIncome ? "/transactions/income/new" : "/transactions/expenses/new"}
            className="mt-3 inline-block font-semibold text-forest underline"
          >
            {isIncome ? "Add income" : "Add expense"}
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-8 rounded-xl bg-bar p-6" aria-label="Total">
            <p className="text-sm text-muted">
              {isIncome ? "Income" : "Expenses"} {user.taxYear} · sum of the rows below
            </p>
            <p className="mt-1 text-3xl font-bold">{eur(total)}</p>
          </section>
          <ul className="mt-6 divide-y divide-bar rounded-xl border border-bar">
            {rows.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/transactions/${isIncome ? "income" : "expenses"}/${t.id}`}
                  className="flex items-start justify-between gap-4 px-4 py-3 hover:bg-bar"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{t.counterparty}</span>
                    <span className="block truncate text-sm text-muted">
                      {t.description} · {formatDate(t.date)}
                      {!isIncome && t.category ? ` · ${t.category}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{eur(gross(t))}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
