// Fictional user and transactions. All figures are demo placeholders.

export type VatRate = 19 | 7 | 0;
export type PaymentStatus = "paid" | "unpaid";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  date: string; // ISO date
  counterparty: string;
  description: string;
  net: number; // EUR
  vatRate: VatRate;
  status: PaymentStatus;
  vatPeriod: string; // YYYY-MM, monthly filing
  category?: string; // expenses only
  paymentDate?: string; // income only, ISO date; set once paid
};

export type User = {
  name: string;
  profession: string;
  filing: "monthly";
  taxYear: number;
};

export const user: User = {
  name: "Alex Example",
  profession: "Freelance designer",
  filing: "monthly",
  taxYear: 2026,
};

export const transactions: Transaction[] = [
  { id: "inc-1", type: "income", date: "2026-08-12", counterparty: "Northwind Studio", description: "Brand identity, phase 1", net: 1800, vatRate: 19, status: "paid", vatPeriod: "2026-08", paymentDate: "2026-08-12" },
  { id: "inc-2", type: "income", date: "2026-09-03", counterparty: "Lindenhof Café", description: "Menu design", net: 450, vatRate: 19, status: "paid", vatPeriod: "2026-09", paymentDate: "2026-09-03" },
  { id: "inc-3", type: "income", date: "2026-09-21", counterparty: "Fabrikam Books", description: "Cover illustration", net: 900, vatRate: 7, status: "paid", vatPeriod: "2026-09", paymentDate: "2026-09-21" },
  { id: "inc-4", type: "income", date: "2026-10-02", counterparty: "Contoso Events", description: "Poster series", net: 1200, vatRate: 19, status: "unpaid", vatPeriod: "2026-10" },
  { id: "inc-5", type: "income", date: "2026-10-09", counterparty: "Harbour Gallery", description: "Exhibition flyers", net: 300, vatRate: 19, status: "paid", vatPeriod: "2026-10", paymentDate: "2026-10-09" },
  { id: "inc-6", type: "income", date: "2026-10-14", counterparty: "Adventure Works Ltd", description: "Consulting day (non-EU client)", net: 600, vatRate: 0, status: "unpaid", vatPeriod: "2026-10" },
  { id: "exp-1", type: "expense", date: "2026-08-05", counterparty: "Pixel Tools GmbH", description: "Design software subscription", net: 25, vatRate: 19, status: "paid", vatPeriod: "2026-08", category: "Software" },
  { id: "exp-2", type: "expense", date: "2026-09-01", counterparty: "Cowork Mitte", description: "Desk rental", net: 180, vatRate: 19, status: "paid", vatPeriod: "2026-09", category: "Rent" },
  { id: "exp-3", type: "expense", date: "2026-09-18", counterparty: "Papier & Co", description: "Print samples", net: 64, vatRate: 7, status: "paid", vatPeriod: "2026-09", category: "Materials" },
  { id: "exp-4", type: "expense", date: "2026-10-01", counterparty: "Cowork Mitte", description: "Desk rental", net: 180, vatRate: 19, status: "paid", vatPeriod: "2026-10", category: "Rent" },
  { id: "exp-5", type: "expense", date: "2026-10-07", counterparty: "Pixel Tools GmbH", description: "Design software subscription", net: 25, vatRate: 19, status: "paid", vatPeriod: "2026-10", category: "Software" },
  { id: "exp-6", type: "expense", date: "2026-10-11", counterparty: "Rail Express", description: "Client visit train ticket", net: 42, vatRate: 7, status: "unpaid", vatPeriod: "2026-10", category: "Travel" },
];
