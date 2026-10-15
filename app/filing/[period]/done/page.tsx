"use client";

import { use } from "react";
import Link from "next/link";
import { formatDate, periodLabel } from "@/lib/transactions";
import { isValidPeriod, resultText } from "@/lib/vat";
import { useFilings } from "@/lib/filings";

export default function Page({ params }: { params: Promise<{ period: string }> }) {
  const { period } = use(params);
  const { ready, filings } = useFilings();
  if (!isValidPeriod(period))
    return (
      <div>
        <p className="text-lg">This period doesn&apos;t exist.</p>
        <Link href="/" className="font-semibold text-forest underline">Back to Dashboard</Link>
      </div>
    );
  if (!ready) return null;
  const f = filings[period];
  const link = "font-semibold text-forest underline";

  if (!f)
    return (
      <div>
        <p className="text-lg">Nothing submitted for this period yet.</p>
        <Link href={`/filing/${period}`} className={link}>Go to the VAT return</Link>
      </div>
    );

  return (
    <div className="max-w-xl">
      <p className="rounded-xl bg-lime-soft p-4 font-semibold text-forest">Demo only. Nothing was sent to the tax office.</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">VAT return submitted (demo)</h1>
      <p className="mt-2">{periodLabel(period)} · submitted {formatDate(f.submittedAt.slice(0, 10))}</p>
      <p className="mt-4 text-3xl font-bold">{resultText(f.result)}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link href="/" className="rounded-lg bg-forest px-5 py-2 font-semibold text-white">Back to Dashboard</Link>
        <Link href={`/filing/${period}`} className={link}>View return</Link>
      </div>
    </div>
  );
}
