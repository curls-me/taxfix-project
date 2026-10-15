Status: Backlog
# TFX-06 — VAT return and confirmation

Map: `docs/information-architecture.md`. Depends on TFX-02, TFX-03 and TFX-05. Build order: 05, 06, 04, 07 — this ticket defines the shared VAT calculation that TFX-04 reuses.

## Scope
Monthly advance VAT return for one period (`/filing/2026-10`). Shows the filing window, a profile banner while the profile is incomplete, a summary of the income and expense items counted in the period, and VAT owed, VAT saved and Result. Continue leads to a confirmation screen (`/filing/2026-10/done`); the dashboard card then shows "Submitted (demo)".

### Site diagram
- Dashboard deadline card → VAT return `/filing/[period]`
  - Profile banner → Profile `/account/profile?from=/filing/[period]` → back to the VAT return
  - Summary row → Income detail `/transactions/income/[id]` or Edit expense `/transactions/expenses/[id]`
  - Continue / Resubmit → Confirmation `/filing/[period]/done` → Dashboard

## Decisions
- Monthly only; period in the URL as `YYYY-MM`. Reason: agreed in the information architecture.
- **Income counts by the month of its payment date** (`paymentDate`); unpaid income is not counted until paid. Reason: freelancers are almost always on cash-based VAT (Istversteuerung); matches the TFX-03 form and the information architecture.
- **Expenses count by the month of their issue date** (`date`), paid or not. Reason: prototype simplification. Demo simplification flag: under real Istversteuerung, VAT on expenses is also deducted only when paid.
- VAT owed = sum of VAT on counted income; VAT saved = sum of VAT on counted expenses; Result = owed − saved. Each item's VAT is the same amount the lists show (`vatAmount()`, so a tester's overwritten VAT is used). Reason: numbers must match across screens.
- **Shared calculation** in `lib/vat.ts`, a pure function with no browser access:
  ```ts
  vatReturn(transactions: Transaction[], period: string /* YYYY-MM */): {
    income: Transaction[];   // type "income", paymentDate in period (unpaid excluded), sorted by paymentDate
    expenses: Transaction[]; // type "expense", date in period, sorted by date
    owed: number;            // sum of vatAmount(income), rounded to cents
    saved: number;           // sum of vatAmount(expenses), rounded to cents
    result: number;          // owed − saved, rounded to cents; negative = refund
    isEmpty: boolean;        // no income and no expenses in period
  }
  ```
  TFX-04's dashboard VAT tile calls the same function. Reason: one source of truth.
- The calculation works only from each item's amount and VAT (via `vatAmount()`), never from a single rate per item. Reason: TFX-07 will later add per-line-item VAT rates to income; it extends `vatAmount()` and this function keeps working. Not built for now.
- Result is never shown with a bare minus: "You pay €X" when positive, "You get back €X" when negative, "Nothing to pay" at zero. Reason: cross-screen wording rule.
- 0% items are listed with €0.00 VAT. Reason: shows they were counted, not forgotten (principle 2).
- Summary lists the items behind each figure, each linking to its detail/edit screen. Reason: principle 2.
- Continue is disabled until the profile is complete (TFX-05) and the period has at least one item; a line under the button says which condition is missing.
- Filing window is a demo date: "1–10 <next month>". Reason: simple, labelled demo.
- Submitting stores it in the browser (`vat-companion.filings.v1`: `{ [period]: { submittedAt, result } }`). Revisiting a submitted period shows "Submitted (demo) on <date>" and the button reads "Resubmit". Reason: Marina's decision; keeps testing simple.
- Confirmation opened by URL without a submission shows "Nothing submitted for this period yet" with a link to the VAT return. Reason: no fake success screen.
- Invalid period in the URL (e.g. `2026-13`, `abc`) shows "This period doesn't exist" with a link to the Dashboard.
- No previous/next month links; split out to `tickets/TFX-08-month-navigation.md`. Reason: keeps this ticket to one PR.
- No automated tests and no test runner. Reason: Marina's decision; the tax logic is placeholder (CLAUDE.md test exception). `npm run build` must pass.
- Confirmation says nothing was sent to the tax office.

## Acceptance criteria
- [ ] `/filing/2026-10` shows the period name, the filing window, the counting rule line and the demo note.
- [ ] Income paid in the period and expenses issued in the period are listed; unpaid income is not; nothing from other months.
- [ ] With the mock data, October 2026 shows VAT owed €57.00, VAT saved €41.89, Result "You pay €15.11".
- [ ] Result equals owed minus saved, worded without a minus sign.
- [ ] Each listed item shows its VAT and links to its detail or edit screen; an edit there changes the return on coming back.
- [ ] Profile banner shows while the profile is incomplete and links to Profile with `?from=`; after saving the tester is back on the return and the banner is gone.
- [ ] Continue is disabled with a reason when the profile is incomplete or the period is empty, and enabled otherwise.
- [ ] Empty period shows dashes for the three figures and a line explaining why.
- [ ] Continue opens the confirmation; the submission survives a reload; the dashboard card shows "Submitted (demo)"; the return then shows "Resubmit".
- [ ] Invalid period shows the not-found message; confirmation without a submission shows its message.
- [ ] `vatReturn` in `lib/vat.ts` matches the signature above.
- [ ] `npm run build` passes.

## Out of scope
Quarterly filing, real submission to ELSTER, tax advice, annual return, month navigation (TFX-08), per-line-item VAT rates (TFX-07), editing amounts on this screen, PDF/export, automated tests.

## Copy
- Rule line: "Income counts in the month it was paid. Unpaid invoices are not counted until paid. Expenses count in the month of their invoice date (demo simplification)."
- Confirmation: "Demo only. Nothing was sent to the tax office."
- Result: "You pay €X" / "You get back €X" / "Nothing to pay".
- Labels: "VAT owed (on income)", "VAT saved (on expenses)", "Result".
- Filing window: "Filing window: 1–10 November 2026 (demo date)".
- Submitted: "Submitted (demo) on 15 Oct 2026". Button: "Resubmit".
- Profile banner: "Complete your profile to file this return." Link: "Complete profile". [copy TBD, align with TFX-05]
- Continue disabled: "Complete your profile first" / "Nothing to file for October 2026 yet".
- Empty period: "No paid income or expenses in October 2026. Add one, or add a payment date to an invoice." [copy TBD]
- Rest [copy TBD].

Spec agreed 2026-10-15.
