"use client";

import { use } from "react";
import Link from "next/link";
import TransactionForm from "@/components/TransactionForm";
import { useTransactions } from "@/lib/transactions";

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
  return <TransactionForm type="expense" t={t} />;
}
