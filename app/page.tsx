import Link from "next/link";

const btn = "rounded-lg bg-forest px-5 py-2 font-semibold text-white";

// Placeholder until TFX-04 builds the real dashboard; quick actions stay.
export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Dashboard</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/transactions/income/new" className={btn}>Add income</Link>
        <Link href="/transactions/expenses/new" className={btn}>Add expense</Link>
      </div>
      <p className="mt-6 text-lg text-muted">More coming soon</p>
    </div>
  );
}
