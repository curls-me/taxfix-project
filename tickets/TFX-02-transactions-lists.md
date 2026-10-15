Status: In review
# TFX-02 — Transactions: income and expenses lists

Map: `docs/information-architecture.md`. Depends on TFX-01.

## Scope
Income and Expenses tabs under Transactions. Each shows a total for 2026 and a list, and opens a detail page: income detail (read-only amounts, savable payment date) and expense detail (edit, delete). Reads mock data plus anything a tester added (browser storage).

### Site diagram
- Transactions
  - Income tab → Income detail
  - Expenses tab → Expense detail (edit, delete)

## Decisions
- Both lists share one list component, to keep the build small.
- Year is fixed to 2026, shown as a label, no year picker: a picker adds scope for nothing.
- No "Still in draft" and no search: out for the prototype, to keep the PR small.
- Payment date on the income detail sets the VAT period, and the page says so (e.g. "Counts toward Q3 2026"). The month-to-quarter rule is a placeholder; it does not feed the VAT return (TFX-06).
- Income net, VAT and total are read-only; only the payment date is editable. Amounts are added or changed in TFX-03.
- Expense edit covers description, date, net amount, VAT rate and category (same fields TFX-03 will use to add one); total and VAT recalculate on save.
- Any expense, including mock ones, can be deleted after a confirm. It is removed in that tester's browser only.
- Empty states show one line plus a link to the add flow (placeholder route until TFX-03).

## Acceptance criteria
- [x] Each tab shows the 2026 total, equal to the sum of the rows shown.
- [x] Income detail shows net, VAT and total (read-only) and a payment date that can be saved.
- [x] After saving a payment date, the page shows the resulting VAT period with a placeholder note.
- [x] Expense can be edited (description, date, net, VAT rate, category); total and VAT update.
- [x] Expense can be deleted; deleting asks to confirm; the list and total update.
- [x] Empty state for each tab, with a link to the add flow.
- [x] Mock data and tester-added items both appear; changes persist in browser storage across reload.
- [x] Demo note remains visible (from TFX-01); `npm run build` passes.

## Out of scope
Search and filters, "Still in draft", year picker, adding transactions (TFX-03), editing income amounts, invoice PDF viewer, creating invoices, resetting demo data.

## Copy
- Income empty: "No income yet for 2026."
- Expenses empty: "No expenses yet for 2026."
- Delete confirm: "Are you sure? This action cannot be undone"
- VAT period note: "Counts toward October 2026" + "(demo rule: the month of the payment date)". Monthly, to match the mock data (filing is monthly), not quarterly.
- Other labels: [copy TBD]

Spec agreed 2026-10-15.
