Status: Ready
# TFX-06 — VAT return and confirmation

Map: `docs/information-architecture.md`. Depends on TFX-02, TFX-03 and TFX-05. The first ticket that adds calculation logic, so it gets unit tests (see CLAUDE.md).

## Scope
Monthly advance VAT return for one period (`/filing/2026-10`). Shows the filing window, a profile banner while the profile is incomplete, a summary of the income and expense items counted in the period, and VAT owed, VAT saved and Result. Continue leads to a confirmation screen (`/filing/2026-10/done`); the dashboard card then shows "Submitted (demo)".

### Site diagram
- Dashboard deadline card → VAT return `/filing/[period]`
  - Profile banner → Profile `/account/profile` → back to the VAT return
  - Summary row → Income detail `/transactions/income/[id]` or Edit expense `/transactions/expenses/[id]`
  - Continue → Confirmation `/filing/[period]/done` → Dashboard

## Decisions
- Monthly only; period in the URL as `YYYY-MM`. Reason: agreed in the information architecture.
- Which items count: income by the month of its payment date (unpaid income is left out); expenses by the month of their issue date. Reason: same demo rule TFX-03 shows on the form ("Counts toward …").
- VAT owed = sum of VAT on counted income; VAT saved = sum of VAT on counted expenses; Result = owed − saved. Each item's VAT uses the same amount the lists show, including a tester's overwritten VAT. Reason: numbers must match across screens.
- One calculation, shared: a pure function takes the transactions and a period and returns the counted items and the three figures. The dashboard VAT tile (TFX-04) uses it too. Reason: one source of truth; it is what the unit tests cover.
- Result is never shown with a bare minus: "You pay €X" when positive, "You get back €X" when negative, "Nothing to pay" at zero. Reason: cross-screen wording rule.
- 0% items are listed with €0.00 VAT. Reason: shows the tester they were counted, not forgotten (principle 2).
- Summary lists the items behind each figure, each linking to its edit/detail screen. Reason: principle 2.
- Continue is disabled until the profile is complete (TFX-05) and the period has at least one counted item; a line under the button says which condition is missing.
- Filing window is a demo date: "1–10 <next month>" for the period. Open question: confirm the wording/date (my recommendation: keep the 10th of the next month, labelled demo).
- Confirmation stores the submission in the browser (period, date submitted, Result at that time). Revisiting a submitted period shows "Submitted (demo) on <date>"; Continue becomes "Submit again (demo)". Open question: allow re-submitting, or lock the period? (My recommendation: allow it; it keeps testing simple.)
- Invalid period in the URL (e.g. `2026-13`, `abc`) shows "This period doesn't exist" with a link to the Dashboard.
- No month switcher on this screen; testers reach other months only by URL. Open question: add previous/next month links? (My recommendation: no, keeps the ticket to one PR.)
- Unit tests need a test runner; the repo has none. Open question: add Vitest as a dev dependency with one test file for the calculation? (My recommendation: yes, smallest standard option.)
- Confirmation says nothing was sent to the tax office.

## Acceptance criteria
- [ ] `/filing/2026-10` shows the period name, the filing window and the demo note.
- [ ] Only income paid in the period and expenses issued in the period are listed; unpaid income is not.
- [ ] VAT owed, VAT saved and Result match the listed items; Result equals owed minus saved, worded without a minus sign.
- [ ] Each listed item shows its VAT and links to its detail or edit screen; an edit there changes the return on return.
- [ ] Profile banner shows while the profile is incomplete and links to Profile; it disappears once complete.
- [ ] Continue is disabled with a reason when the profile is incomplete or the period is empty, and enabled otherwise.
- [ ] Empty period shows dashes for the three figures and a line explaining why.
- [ ] Continue opens the confirmation; the submission survives a reload; the dashboard card shows "Submitted (demo)".
- [ ] Invalid period shows the not-found message.
- [ ] Unit tests cover: period filtering (paid/unpaid income, expense issue date), VAT overrides, 0% items, positive/negative/zero Result, empty period.
- [ ] `npm run build` passes.

## Out of scope
Quarterly filing, real submission to ELSTER, tax advice, annual return, month switcher, editing amounts on this screen, PDF/export.

## Copy
- Confirmation: "Demo only. Nothing was sent to the tax office."
- Result: "You pay €X" / "You get back €X" / "Nothing to pay".
- Labels: "VAT owed (on income)", "VAT saved (on expenses)", "Result".
- Filing window: "Filing window: 1–10 November 2026 (demo date)".
- Profile banner: "Complete your profile to file this return." Link: "Complete profile". [copy TBD, align with TFX-05]
- Continue disabled: "Complete your profile first" / "Nothing to file for October 2026 yet".
- Empty period: "No paid income or expenses in October 2026. Add one, or mark an invoice as paid." [copy TBD]
- Rest [copy TBD].
