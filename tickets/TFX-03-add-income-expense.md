Status: In review
# TFX-03 — Add income and add expense

Map: `docs/information-architecture.md`. Depends on TFX-02.

## Scope
One shared form for adding income and adding an expense: invoice number, issue date, party (client or supplier), description, category, net amount, VAT rate, VAT amount, gross amount. Income also has a payment date. Saved to browser storage; save returns to the matching list. The same form replaces the TFX-02 expense edit fields, so add and edit behave alike.

### Site diagram
- Income tab / Dashboard → Add income (`/transactions/income/new`) → back to Income tab
- Expenses tab / Dashboard → Add expense (`/transactions/expenses/new`) → back to Expenses tab
- Expense row → Edit expense (same form, from TFX-02)

## Decisions
- VAT period is not a field. It is shown as a read-only line: "Counts toward <month> 2026" (income: payment date; expense: issue date). Reason: the period is derived (principle 2), and TFX-02 already works this way.
- Income payment date is optional. Without it the line reads "Not counted until paid" and the item is excluded from the period. Reason: unpaid invoices are normal.
- VAT amount and gross are pre-filled from net and rate and can be overwritten. An overwritten value shows an "edited" marker and a "Reset to calculated" link. Changing net or rate recalculates and clears the override. A saved override is kept when the item is reopened. Reason: principle 3, and avoids silently replacing the tester's number.
- VAT rates offered: 19%, 7%, 0%. 0% on an expense requires a reason, with a short plain-language note; 0% on income needs none.
- Document upload is a visual drop zone only; the file is not stored or read.
- Categories come from one short fixed list (placeholder, shared with TFX-02's edit).
- Required: issue date, party, net amount, VAT rate, category; income also invoice number. Description and expense invoice number are optional. [Marina's call if different: these were my defaults, not discussed.]
- Amounts are euros with two decimals; negative or non-numeric net is rejected.
- Adding only: income amounts stay read-only on Income detail (TFX-02). Editing them is a later ticket.
- Dashboard totals are TFX-04's job; this ticket only guarantees the item appears in its list and tab total.
- Items get an id and are stored with the TFX-02 browser-storage items.

## Acceptance criteria
- [x] Add income and Add expense open the same form with the right party label and fields.
- [x] Required fields are marked and block saving when empty, with an inline message.
- [x] VAT and gross pre-fill from net and rate; overwriting shows "edited" and Reset restores the calculated values.
- [x] VAT period line updates with the payment date (income) or issue date (expense); no payment date shows "Not counted until paid".
- [x] 0% on an expense asks for a reason and shows the note; saving without it is blocked.
- [x] Save adds the item to the matching list and its tab total, then returns to that list; it survives a reload.
- [x] Cancel returns without saving.
- [x] Expense edit (TFX-02) uses the same form and keeps overwritten VAT.
- [x] Demo note remains visible; `npm run build` passes.

## Out of scope
Reading data from the uploaded document, bank import, Create invoice, editing income amounts, quarterly periods, dashboard totals (TFX-04), VAT return (TFX-06).

## Copy
- Period line: "Counts toward October 2026 (demo rule: the month of the payment date)" (expense: month of the issue date).
- Unpaid: "Not counted until paid".
- Override: "edited" / "Reset to calculated".
- 0% expense note and reason options: [copy TBD]
- Field labels, categories, error messages: [copy TBD]

Spec agreed 2026-10-15.
