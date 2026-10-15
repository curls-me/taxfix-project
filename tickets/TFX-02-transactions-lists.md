Status: Backlog
# TFX-02 — Transactions: income and expenses lists

Needs `/spec TFX-02` before build. Map: `docs/information-architecture.md`. Depends on TFX-01.

## Scope
Income and Expenses tabs under Transactions. Each shows a total for the year (and "Still in draft"), search, a list, and opens a detail page (income detail with payment date; edit expense with delete). Reads mock data plus anything a tester added (browser storage).

## Decisions (draft)
- Both lists share one list component.
- Payment date on the income detail sets the VAT period, and the page says so.
- Filters beyond search are out unless the spec adds them.

## Acceptance criteria (draft)
- [ ] Totals equal the sum of the rows shown.
- [ ] Income detail shows net, VAT and total, and a payment date that can be saved.
- [ ] Expense can be edited and deleted (deleting asks to confirm).
- [ ] Empty state for each tab.

## Out of scope
Adding transactions (TFX-03), invoice PDF viewer, creating invoices.

## Copy
[copy TBD]
