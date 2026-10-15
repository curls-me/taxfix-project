Status: Backlog
# TFX-04 — Dashboard

Map: `docs/information-architecture.md`. Depends on TFX-02, TFX-03, TFX-05 (profile completeness) and TFX-06 (shared VAT calculation and filings record). Build order: 05, 06, 04, 07.

## Scope
Home screen (`/`) replacing the placeholder: three tiles (Income 2026, Expenses 2026, VAT for October 2026), a monthly income-and-expenses chart for 2026, the next VAT deadline card, a to-do card plus a Profile call to action, and quick actions (Add income, Add expense). Read-only; this ticket stores no new data.

### Site diagram
- Dashboard `/`
  - Income tile → `/transactions/income`
  - Expenses tile → `/transactions/expenses`
  - VAT tile and deadline card → `/filing/2026-10`
  - To-do card and Profile arrow CTA (profile incomplete) → `/account/profile?from=/`
  - Quieter "Profile" link (profile complete) → `/account/profile?from=/`
  - Add income → `/transactions/income/new`; Add expense → `/transactions/expenses/new`

## Decisions
- **Payment date decides VAT (cash-based VAT, Istversteuerung).** In the VAT tile, income counts toward the month of its payment date and unpaid income is not counted; expenses count by issue date. Reason: Marina's decision 2026-10-15; most German freelancers file this way.
- Income and Expenses tiles show the gross sum of all rows in that list, unpaid included, the same number as the list total (TFX-02). Reason: testers can check one against the other (principle 2). The VAT tile caption explains why its basis differs.
- Each tile has a one-line "made of" caption.
- VAT tile shows the Result for October 2026 with "VAT owed" and "VAT saved" underneath. It calls the shared calculation from TFX-06, `vatReturn(transactions, period)` in `lib/vat.ts` (returns `owed`, `saved`, `result`, `isEmpty`, plus the counted items); no separate dashboard logic. Reason: one source of truth; same numbers and words as the VAT return.
- Current period is a fixed demo constant, October 2026 (`2026-10`), not today's date. Reason: the demo looks the same on every test day.
- Chart: one bar pair (income, expenses) per month, Jan–Dec 2026, by issue date, gross amounts, simple CSS bars (no chart library), with a text table for screen readers.
- Deadline card: "October 2026 · due 10 Nov 2026 (demo date)", button "Open VAT return". When TFX-06's filings record (`vat-companion.filings.v1`) has October 2026, it reads "Submitted (demo)".
- Profile incomplete (TFX-05 helper): to-do card plus a clear arrow CTA "Complete your profile →" to `/account/profile?from=/`. Profile complete: to-do card hidden, a quieter "Profile" link remains. Reason: one clear next step; Profile is the gate to filing.
- Empty state is built (shown when there are zero transactions) and checked by temporarily emptying mock data locally; no "start empty" switch.
- No Create invoice button.

## Acceptance criteria
- [ ] Income and Expenses tiles equal the Income and Expenses list totals (unpaid included), also after adding or editing an item and reloading.
- [ ] VAT tile owed, saved and Result equal the `/filing/2026-10` figures (income paid in October, expenses issued in October; unpaid income not counted).
- [ ] Marking an October invoice as paid changes the VAT tile; the Income tile total does not change.
- [ ] Chart bars per month add up to the tile totals.
- [ ] Each tile, card and link goes to the screen in the site diagram.
- [ ] Profile incomplete: to-do card and arrow CTA show and open `/account/profile?from=/`. Profile complete: both gone, quieter link remains.
- [ ] Deadline card shows "Submitted (demo)" once October 2026 is in the filings record, and survives a reload.
- [ ] Empty state for zero transactions: tiles show €0.00, chart shows a short message, quick actions remain.
- [ ] Usable at phone width and by keyboard; demo note visible; `npm run build` passes.

## Out of scope
Feedback card, language switcher, quarterly deadlines, year switcher, past-period deadlines, Create invoice, real deadline rules, a "start empty" switch.

## Copy
- Tiles: "Income 2026", "Expenses 2026", "VAT · October 2026".
- Tile captions: "<n> invoices, paid and unpaid · sum of the Income list" / "<n> expenses · sum of the Expenses list" / "Paid income and expenses of October (demo rule)".
- VAT tile: "VAT owed", "VAT saved", Result "You pay €X" / "You get back €X" / "Nothing to pay" (as TFX-06).
- Deadline card: "Next VAT return", "October 2026 · due 10 Nov 2026 (demo date)", button "Open VAT return"; after submit "Submitted (demo)".
- To-do card: "Complete your profile to file your VAT return". CTA: "Complete your profile →". Quiet link: "Profile".
- Empty chart: "No income or expenses yet. Add your first one to see the chart."
- Rest [copy TBD].

Spec agreed 2026-10-15.
