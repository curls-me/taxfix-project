# UX brief — TFX-07 Create invoice (quick)

Ticket: `tickets/TFX-07-create-invoice.md`. Marina's answers applied 2026-10-15; ticket now Ready. Entry point corrected 2026-10-15: there is no "Create new" button in the code; the Income tab gets a "Create invoice" button next to "Add income". Items marked **(suggestion)** are mine.

## Key screens

**Create invoice** (`/transactions/income/invoice`)
- Purpose: write an invoice and record it as income in one go.
- Top to bottom: From (sender block from Profile, read-only) · Invoice number, Issue date, Service date · Client name, Client address · Line items (description, net, VAT rate, remove) + "Add line" · Totals box: Net, VAT (one row per rate when mixed), Total · Payment terms + "Due 29 Oct 2026" · Notes · period line "Not counted until paid".
- Main action: **Create invoice** (primary). **Cancel** (link).
- Layout follows a paper invoice top to bottom **(suggestion)** so it reads as an invoice, not a bookkeeping form.

**Income detail** (existing): adds a "Line items" list (description, net, rate, VAT) under the totals, and the due date.

## Main flow
1. Income tab → Create invoice.
2. Number and dates are pre-filled; tester checks them.
3. If the profile is incomplete, a warning and "Complete your profile →" appear; tester may go there (draft kept) and come back, or carry on.
4. Enters client and one or more lines, each with its rate; totals update live.
5. Picks terms; sees due date.
6. Create invoice → validation → back to Income list with "Invoice created" and the new row marked Unpaid.
7. Later: opens the row, sets a payment date → it counts toward that month's VAT return.

## UI principles
- **Clarity:** "Net amount, before VAT" on each line; each line shows its rate as "19% (standard)" / "7% (reduced)" / "0%"; totals box names the rate behind each VAT row. Errors name the line and fix ("Add a description for line 2").
- **Resilience:** values kept on error, scroll to first error; draft kept across the Profile round-trip, cleared on save or cancel; removing the last line is disabled; Create disabled while saving; long descriptions wrap.
- **Access:** visible labels, line fields labelled with line number for screen readers, "Add line" and remove reachable by keyboard, one column on narrow screens with each line stacked and totals under the lines.

## States

| State | What the tester sees / can do |
|---|---|
| Fresh | Next number, today's dates, one empty line at 19%, totals €0.00 |
| Profile incomplete | Warning + "Complete your profile →"; saving allowed |
| Back from Profile | Draft restored; sender block now filled |
| Validation error | Inline per field + top line "Please fix 2 fields to create the invoice" |
| Duplicate number | "Invoice number 2026-004 is already used. Choose another." |
| Mixed rates | Totals show one VAT row per rate; list row later shows "Mixed" |
| 10 lines reached | "Add line" disabled with "Up to 10 lines in this demo" |
| Storage unavailable | "Couldn't save in this browser. Your entries are still here." **(suggestion)** |
| Success | Income list, "Invoice created", row Unpaid, tab total updated |

## Connections

| From → to | How | Status |
|---|---|---|
| Income tab → Create invoice | "Create invoice" button next to "Add income" | New (no "Create new" exists in code) |
| Dashboard → Create invoice | none | **Missing.** Dashboard has only Add income / Add expense. Suggest leaving it (fewer entry points), or a later ticket |
| Create invoice → Profile | "Complete your profile →" with `?from=/transactions/income/invoice` | New; relies on TFX-05's return-to rule |
| Profile → Create invoice | Profile Save returns via `from` | Works if TFX-05 accepts this path (internal, starts with `/`) |
| Create invoice → Income list | Save and Cancel | New |
| Income list → Income detail | Row click | Exists (TFX-02); detail gains line items |
| Income detail → VAT return | none | **Dead end for this loop.** After setting a payment date there is no way to the return except Dashboard. Suggest a "See it in the VAT return" link later; not in this ticket |
| VAT return → Income detail | Summary row link (TFX-06) | Exists once TFX-06 is built; mixed-rate rows show "Mixed" |
| Create invoice → VAT return | none | Intended: an unpaid invoice is not in any return yet |

Next step: `/build TFX-07` once Marina marks the ticket ready.
