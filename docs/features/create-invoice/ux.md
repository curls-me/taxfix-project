# UX brief — TFX-07 Create invoice (quick)

Ticket: `tickets/TFX-07-create-invoice.md`. Drafted before the spec was agreed; open questions are in the ticket. Items marked **(suggestion)** are mine.

## Key screens

**Create invoice** (`/transactions/income/invoice`)
- Purpose: write an invoice and record it as income in one go.
- Top to bottom: From (sender block from Profile, read-only) · Invoice number, Issue date, Service date · Client name, Client address · Line items (description, net, remove) + "Add line" · VAT rate (19% standard / 7% reduced / 0%) · Totals box: Net, VAT, Total · Payment terms + "Due 29 Oct 2026" · Notes · period line "Not counted until paid".
- Main action: **Create invoice** (primary). **Cancel** (link).
- Layout follows a paper invoice top to bottom **(suggestion)** so it reads as an invoice, not a bookkeeping form.

**Income detail** (existing): adds a "Line items" list under the totals when present.

## Main flow
1. Income tab → Create new.
2. Number and dates are pre-filled; tester checks them.
3. If the sender block says "Complete your profile", tester may go there and come back, or carry on.
4. Enters client and one or more lines; totals update live.
5. Picks terms; sees due date.
6. Create invoice → validation → back to Income list with "Invoice created" and the new row marked Unpaid.
7. Later: opens the row, sets a payment date → it counts toward that month.

## UI principles
- **Clarity:** "Net amount, before VAT" on each line; totals box states the rate used ("VAT 19%"). Errors name the field and fix ("Add a description for line 2").
- **Resilience:** values kept on error, scroll to first error; Profile round-trip keeps the draft **(suggestion: hold it in session storage)**; removing the last line is disabled; Create disabled while saving to avoid doubles; long descriptions wrap.
- **Access:** visible labels, line fields labelled with line number for screen readers, "Add line" and remove reachable by keyboard, one column on narrow screens with totals under the lines.

## States

| State | What the tester sees / can do |
|---|---|
| Fresh | Next number, today's dates, one empty line, 19% preselected, totals €0.00 |
| Profile incomplete | Sender block: "Your details come from your profile. Complete your profile" (link); saving allowed |
| Validation error | Inline per field + top line "Please fix 2 fields to create the invoice" |
| Duplicate number | "Invoice number 2026-004 is already used. Choose another." |
| 10 lines reached | "Add line" disabled with "Up to 10 lines in this demo" |
| Storage unavailable | "Couldn't save in this browser. Your entries are still here." **(suggestion)** |
| Success | Income list, "Invoice created", row Unpaid, tab total updated |

## Flagged (would change the ticket)
- Draft kept across the Profile round-trip is my suggestion; without it, the link loses work, so the link could instead open in a new tab.
- Income detail gains a line-item list: touches the TFX-02 screen.

Next step: `/build TFX-07` after the spec is agreed.
