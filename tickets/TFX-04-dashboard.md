Status: Ready
# TFX-04 — Dashboard

Map: `docs/information-architecture.md`. Depends on TFX-02, TFX-03; reads profile completeness (TFX-05) and the VAT calculation and "submitted" state (TFX-06). Build order: 05, 04, 06, 07.

## Scope
Home screen (`/`) replacing the placeholder: three tiles (Income 2026, Expenses 2026, VAT for October 2026), a monthly income-and-expenses chart for 2026, the next VAT deadline card, a to-do card, and quick actions (Add income, Add expense). Read-only; no new data is stored by this ticket.

### Site diagram
- Dashboard `/`
  - Income tile → `/transactions/income`
  - Expenses tile → `/transactions/expenses`
  - VAT tile and deadline card → `/filing/2026-10`
  - To-do card (only while profile incomplete) → `/account/profile`
  - Add income → `/transactions/income/new`; Add expense → `/transactions/expenses/new`

## Decisions
- Income and Expenses tiles show the **gross sum of all rows in that list**, exactly the same number as the list total (TFX-02 `TransactionList`). Reason: testers can check one against the other (principle 2).
- Each tile has a one-line "made of" caption, e.g. "6 invoices · sum of the Income list". Reason: principle 2.
- VAT tile shows the **Result for the current period** with "VAT owed" and "VAT saved" underneath, using TFX-06's calculation and wording (no bare minus signs). Reason: same numbers and words as the VAT return.
- Current period is a fixed demo constant, `2026-10`, not today's date. Reason: the prototype must look the same on every test day; mock data is built around October.
- Chart: one bar pair (income, expenses) per month, Jan–Dec 2026, grouped by issue date, gross amounts, simple CSS bars (no chart library). Months with no data show empty bars. A text summary or table sits under the chart for screen readers.
- Deadline card: "October 2026 VAT return · due 10 Nov 2026 (demo date)" with "Open VAT return". After the tester confirms on TFX-06, it reads "Submitted (demo)".
- To-do card appears only while the profile is incomplete (TFX-05 helper), links to Profile; hidden once complete.
- No Create invoice button.
- Open question: should the Income tile include unpaid invoices? Recommendation: yes, to match the list; the VAT tile already counts paid only, and its caption says so.
- Open question: how does a tester reach the empty state when mock data is always loaded and income cannot be deleted? Recommendation: build the empty state (shown when there are zero transactions) and verify it by temporarily emptying mock data locally; no "start empty" switch in this ticket.
- Open question: is "10 Nov" the right placeholder deadline? Recommendation: yes, labelled "demo date"; real rules (and Dauerfristverlängerung) are out of scope.

## Acceptance criteria
- [ ] Income and Expenses tiles equal the totals on the Income and Expenses lists, including after adding or editing an item and reloading.
- [ ] VAT tile Result, owed and saved equal the October 2026 VAT return figures.
- [ ] Chart bars per month add up to the tile totals.
- [ ] Each tile, the deadline card and the to-do card link to the screens in the site diagram.
- [ ] To-do card shows while the profile is incomplete and disappears once it is complete.
- [ ] Deadline card shows "Submitted (demo)" after confirming the October return, and survives a reload.
- [ ] Empty state for zero transactions: tiles show €0.00, chart shows a short message, quick actions remain.
- [ ] Usable at phone width and by keyboard; demo note visible; `npm run build` passes.

## Out of scope
Feedback card, language switcher, quarterly deadlines, year switcher, past-period deadlines, Create invoice, real deadline rules.

## Copy
- Tiles: "Income 2026", "Expenses 2026", "VAT · October 2026".
- Tile captions: "<n> invoices · sum of the Income list" / "<n> expenses · sum of the Expenses list" / "Paid income and expenses in October (demo rule)".
- VAT tile: "VAT owed", "VAT saved", "Result: you pay €X" / "Result: you get back €X" (match TFX-06).
- Deadline card: "Next VAT return", "October 2026 · due 10 Nov 2026 (demo date)", button "Open VAT return"; after submit "Submitted (demo)".
- To-do card: "Complete your profile to file your VAT return", link "Go to profile".
- Empty chart: "No income or expenses yet. Add your first one to see the chart."
- Rest [copy TBD].
