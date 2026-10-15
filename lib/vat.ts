import type { Transaction } from "@/data/mock";
import { eur, vatAmount } from "@/lib/transactions";

const cents = (n: number) => Math.round(n * 100) / 100;
const sum = (rows: Transaction[]) => cents(rows.reduce((s, t) => s + vatAmount(t), 0));

// shortcut: expenses count by issue date even if unpaid; real cash-based VAT deducts on payment.
// Income counts by payment month; unpaid income is not counted.
export function vatReturn(transactions: Transaction[], period: string /* YYYY-MM */) {
  const income = transactions
    .filter((t) => t.type === "income" && t.paymentDate?.startsWith(period))
    .sort((a, b) => a.paymentDate!.localeCompare(b.paymentDate!));
  const expenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(period))
    .sort((a, b) => a.date.localeCompare(b.date));
  const owed = sum(income);
  const saved = sum(expenses);
  return {
    income,
    expenses,
    owed,
    saved,
    result: cents(owed - saved),
    isEmpty: income.length === 0 && expenses.length === 0,
  };
}

export const isValidPeriod = (p: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(p);

// Never a bare minus: positive = pay, negative = refund.
export const resultText = (r: number) =>
  r > 0 ? `You pay ${eur(r)}` : r < 0 ? `You get back ${eur(-r)}` : "Nothing to pay";
