Status: Backlog
# TFX-07 — Create invoice

Map: `docs/information-architecture.md`. Depends on TFX-03 (income storage), TFX-05 (profile, for the sender block). UX: `docs/features/create-invoice/ux.md`.

Why now (one line, replaces a problem definition): writing the invoice in the app means the income, its VAT and its period are right from the start, so testers see the full loop from invoice to VAT return without re-typing anything. [Open question: confirm this reason is enough, or park TFX-07 again.]

## Scope
A Create invoice form: invoice number, issue date, service date, client (name and address), line items (description, net amount), one VAT rate for the invoice, live totals (net, VAT, total), payment terms with the due date, and optional notes. The sender block (your name, address, tax number) is read from Profile. Saving adds the invoice to Income as unpaid; it then behaves like any other income item.

### Site diagram
- Income tab → Create new → Create invoice (`/transactions/income/invoice`) → back to Income tab
- Income tab → invoice row → Income detail (`/transactions/income/[id]`), which also lists the line items
- Create invoice → sender block "Complete your profile" link → Profile (`/account/profile`) → back to Create invoice

## Decisions
- One VAT rate per invoice, not per line. Reason: every income item today has one net amount and one rate, so totals, lists and the VAT return keep working unchanged. [Open question: per-line rates would need a data-model change.]
- Invoice is stored as an income item (same store as TFX-03): net = sum of line nets, date = issue date, status unpaid, no payment date. Extra fields kept on the item: service date, client address, line items, payment terms, notes. Reason: one list of income, no second store.
- Unpaid until a payment date is set on Income detail; period line reads "Not counted until paid", as in TFX-03. Reason: payment date decides the period (IA rule).
- Invoice number is pre-filled with the next free number (format `2026-001`), editable; a number already used on another income item blocks saving. Reason: German invoices need unique numbers; pre-fill removes guesswork.
- Issue date defaults to today; service date defaults to the issue date and can differ. Reason: most invoices are issued for work just done.
- Client is free text (name required, address optional); no saved client list. Reason: keep it small.
- Line items: at least one, maximum 10; each needs a description and a net amount above 0. Reason: enough for a demo, avoids an endless form.
- Payment terms: "Due on receipt", "14 days", "30 days" (default 14); the due date is shown, not stored as a separate field. [Open question: whether the due date should appear on the Income list.]
- Sender block reads name, address and tax number from Profile. If Profile is incomplete, the block shows "Complete your profile" with a link, and saving is still allowed. [Open question: block saving instead?]
- No preview, PDF or sending. Saving only records it. Reason: out of scope; keeps it to one screen.
- Created invoices can't be edited after saving (same as income amounts in TFX-03); delete stays as on Income detail today. Reason: editing is a later ticket.
- Small change to Income detail: if the item has line items, list them under the totals. Reason: show the working (principle 2).
- "Coming soon" on Create new is removed.

## Acceptance criteria
- [ ] Income tab "Create new" opens Create invoice; no "Coming soon" remains.
- [ ] Invoice number is pre-filled with the next free number and can be changed; a duplicate blocks saving with an inline message.
- [ ] Issue date defaults to today, service date to the issue date; both editable.
- [ ] Lines can be added (up to 10) and removed (not below 1); each needs a description and a net amount above 0.
- [ ] Net, VAT and total update live from the lines and the chosen rate (19%, 7%, 0%).
- [ ] Payment terms show the resulting due date.
- [ ] Sender block shows Profile details, or "Complete your profile" with a working link when incomplete.
- [ ] Required fields are marked and block saving with an inline message; nothing entered is lost.
- [ ] Save adds one unpaid income item with the summed net to the Income list and tab total, returns to the list, and survives a reload.
- [ ] Income detail of a created invoice lists its line items; setting a payment date there moves it into that month's period.
- [ ] Cancel returns without saving.
- [ ] Demo note visible; `npm run build` passes.

## Out of scope
Logo upload, PDF download or preview, sending by email, e-invoice formats (XRechnung, ZUGFeRD), per-line VAT rates, saved clients, editing a saved invoice, discounts, reverse-charge wording, reminders for overdue invoices.

## Copy
- Page title: "Create invoice"
- Button on Income tab: "Create new"
- Period line: "Not counted until paid"
- Sender block, incomplete: "Your details come from your profile. Complete your profile"
- Duplicate number: "Invoice number 2026-004 is already used. Choose another."
- Save confirmation: "Invoice created"
- Field labels, line-item labels, payment term options, other errors: [copy TBD]
