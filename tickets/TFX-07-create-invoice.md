Status: In progress
# TFX-07 — Create invoice

Map: `docs/information-architecture.md`. Depends on TFX-03 (income storage), TFX-05 (profile, for the sender block). UX: `docs/features/create-invoice/ux.md`.

Why (one line, replaces a problem definition): writing the invoice in the app means the income and its VAT are right from the start (it counts toward a VAT return once marked paid), so testers see the full loop from invoice to VAT return without re-typing anything.

Timing: not built in the current pipeline run. Next PR, once Marina marks this ticket ready (decided 2026-10-15).

## Scope
A Create invoice form: invoice number, issue date, service date, client (name and address), line items (description, net amount, VAT rate per line), live totals (net, VAT, total), payment terms with the due date, and optional notes. The sender block (your name, address, tax number) is read from Profile. Saving adds the invoice to Income as unpaid; it then behaves like any other income item.

### Site diagram
- Income tab → Create invoice button → Create invoice (`/transactions/income/invoice`) → back to Income tab
- Income tab → invoice row → Income detail (`/transactions/income/[id]`), which also lists the line items
- Create invoice → "Complete your profile →" → Profile (`/account/profile?from=/transactions/income/invoice`) → back to Create invoice, draft kept

## Decisions
- VAT rate per line item (19%, 7%, 0%), default 19%. Invoice VAT = sum of each line's VAT (rounded per line). Reason: Marina's decision; real invoices mix rates.
- Invoice is stored as an income item (same store as TFX-03): net = sum of line nets, date = issue date, status unpaid, no payment date. Extra fields kept on the item: service date, client address, line items, payment terms, notes. Reason: one list of income, no second store.
- Totals box shows VAT per rate when lines mix rates ("VAT 19% on €800.00", "VAT 7% on €200.00"). Reason: show the working.

### Dependency: extension to shared types and VAT calculation (made by this ticket, TFX-06 unchanged)
1. `data/mock.ts`: add `InvoiceLine = { description: string; net: number; vatRate: VatRate }` and optional `lines?: InvoiceLine[]` on `Transaction` (plus optional `serviceDate`, `clientAddress`, `paymentTerms`, `notes`). Items without `lines` behave exactly as today.
2. `lib/transactions.ts` `vatAmount(t)`: if `t.lines` is present and there is no `vatOverride`, return the sum of per-line VAT (each `round(net × rate) / 100`); otherwise unchanged. `gross(t)` follows from it. Widen the `Amounts` type to include `lines`.
3. Top-level `vatRate` on an invoice item: the rate if all lines share it; otherwise the highest line rate as a stand-in. Anywhere a single rate is shown (lists, Income detail, VAT return rows) shows "Mixed" when line rates differ.
4. `lib/vat.ts` `vatReturn(transactions, period)` (TFX-06): no change needed **if** it takes each item's VAT from `vatAmount(t)`, as TFX-06's decision "same amount the lists show" implies. If it computes `net × vatRate` itself, it must switch to `vatAmount`. No unit test (decided 2026-10-15: placeholder tax logic, no test runner added); `/verify` checks by hand that a paid mixed-rate invoice (19% + 7% lines) counts the per-line VAT sum in the month of its payment date, and an unpaid one is not counted.
5. Created invoices' VAT: no `vatOverride` is set, so they never show the "edited" marker.
- Unpaid until a payment date is set on Income detail; period line reads "Not counted until paid", as in TFX-03. Reason: VAT is cash-based (Istversteuerung): the payment date decides the month; unpaid income is not counted.
- Invoice number is pre-filled with the next free number (format `2026-001`), editable; a number already used on another income item blocks saving. Reason: German invoices need unique numbers; pre-fill removes guesswork.
- Issue date defaults to today; service date defaults to the issue date and can differ. Reason: most invoices are issued for work just done.
- Client is free text (name required, address optional); no saved client list. Reason: keep it small.
- Line items: at least one, maximum 10; each needs a description and a net amount above 0. Reason: enough for a demo, avoids an endless form.
- Payment terms: "Due on receipt", "14 days", "30 days" (default 14); the due date is shown on the invoice and Income detail only, not on the Income list (decided). Not stored as a separate field.
- Sender block reads name, address and tax number from Profile (`vat-companion.profile.v1`, TFX-05). If Profile is incomplete: a warning plus an arrow button "Complete your profile →" to `/account/profile?from=/transactions/income/invoice`; saving is still allowed (decided).
- The draft is kept while the tester goes to Profile and back (browser session storage, cleared on save or cancel) (decided). Reason: never lose what the tester entered.
- No preview, PDF or sending. Saving only records it. Reason: out of scope; keeps it to one screen.
- Created invoices can't be edited after saving (same as income amounts in TFX-03); delete stays as on Income detail today. Reason: editing is a later ticket.
- Small change to Income detail: if the item has line items, list them under the totals. Reason: show the working (principle 2).
- Income tab gets a "Create invoice" button next to "Add income" (see notes below).

### Notes from spec check against current code (2026-10-15)
- **Entry point:** the Income tab has no "Create new" / "Coming soon" today; it has one "Add income" button (`components/TransactionList.tsx`) to `/transactions/income/new`. Recommended: on the Income tab only, add a second button "Create invoice" next to "Add income" (no menu). "Coming soon" lives only in the unused `components/Placeholder.tsx`.
- **`vatPeriod` is required on `Transaction`:** a new invoice sets `vatPeriod` = issue month (same rule as the Add income form for unpaid items); Income detail already rewrites it to the payment month when paid.
- **`gross(t)` does not follow from `vatAmount(t)` today:** it computes `net × (100 + rate)` directly. For items with `lines` it must become `net + vatAmount(t)` (rounded to cents).
- **Single-rate labels to switch to "Mixed":** `app/transactions/income/[id]/page.tsx` ("VAT {rate}%"), `app/filing/[period]/page.tsx` row label, and the Income list row.
- **`vatReturn` already uses `vatAmount(t)`** (`lib/vat.ts`), so it needs no change once `vatAmount` handles lines.
- **Profile:** key `vat-companion.profile.v1`; fields are name, taxNumber, street, postcode, city. Sender block = name, street, postcode + city, tax number; "complete" = `isProfileComplete`. `safeFrom` already accepts `/transactions/income/invoice`.
- **No test runner exists** and none is added (decided 2026-10-15); the mixed-rate check is done by hand in `/verify`.
- **Invoice items with lines are not editable through the edit form** (it would overwrite net/rate and break the lines); Income detail's payment-date control is the only change allowed, plus delete.

## Acceptance criteria
- [x] Income tab shows "Create invoice" next to "Add income" and it opens Create invoice; no "Coming soon" remains.
- [x] Invoice number is pre-filled with the next free number and can be changed; a duplicate blocks saving with an inline message.
- [x] Issue date defaults to today, service date to the issue date; both editable.
- [x] Lines can be added (up to 10) and removed (not below 1); each needs a description, a net amount above 0 and a VAT rate.
- [x] Net, VAT and total update live from the lines and their rates; mixed rates show VAT per rate.
- [x] Payment terms show the resulting due date; the Income list does not show it.
- [x] Sender block shows Profile details, or a warning and "Complete your profile →" when incomplete; Profile's Save returns to the invoice with the draft intact.
- [x] A paid mixed-rate invoice counts the sum of its per-line VAT in the VAT return and dashboard (checked by hand in /verify).
- [x] Required fields are marked and block saving with an inline message; nothing entered is lost.
- [x] Save adds one unpaid income item with the summed net to the Income list and tab total, returns to the list, and survives a reload.
- [x] A newly created (unpaid) invoice does not appear in any VAT return or dashboard VAT figure until a payment date is set.
- [x] Income detail of a created invoice lists its line items; setting a payment date there moves it into that month's period.
- [x] Cancel returns without saving.
- [x] Demo note visible; `npm run build` passes.

## Out of scope
Logo upload, PDF download or preview, sending by email, e-invoice formats (XRechnung, ZUGFeRD), net totals split by rate on the VAT return, saved clients, editing a saved invoice, discounts, reverse-charge wording, reminders for overdue invoices.

## Copy
- Page title: "Create invoice"
- Button on Income tab: "Create invoice"
- Period line: "Not counted until paid"
- Sender block, incomplete: "Your name, address and tax number are missing. Invoices need them." Button: "Complete your profile →" [copy TBD, align with TFX-05]
- Mixed rate shown in lists: "Mixed"
- Duplicate number: "Invoice number 2026-004 is already used. Choose another."
- Save confirmation: "Invoice created"
- Field labels, line-item labels, payment term options, other errors: [copy TBD]

Spec agreed 2026-10-15.
