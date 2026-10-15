# UX brief — TFX-06 VAT return and confirmation

Ticket: `tickets/TFX-06-vat-return.md`. Items marked **(suggestion)** are mine, not in the ticket.

## Key screens

**VAT return** (`/filing/[period]`): know what I owe for the month and file it.
- Top to bottom: title "VAT return, October 2026", filing window line, rule line "Income counts in the month it was paid. Unpaid invoices are not counted until paid.", profile banner (only while incomplete), three figures (VAT owed, VAT saved, Result), summary in two groups (Income / Expenses, each row: party, date counted — payment date for income, invoice date for expenses — VAT, link), Continue.
- Result is the largest figure, worded "You pay / You get back / Nothing to pay". **(suggestion)** Show the sum under it ("€57.00 owed − €41.89 saved") so the working is visible without scrolling.
- Main action: **Continue** (or **Resubmit** once submitted). Disabled reason shown as text right under it.

**Confirmation** (`/filing/[period]/done`): know it is done, and that it is a demo.
- "Demo only. Nothing was sent to the tax office." first, then period and Result as submitted.
- Main action: **Back to Dashboard**.

## Main flow

1. Dashboard deadline card → VAT return for the period.
2. Profile incomplete? Banner → Profile → save returns here; banner gone.
3. Tester checks figures, opens a summary row to fix an item, returns; figures update.
4. Decision: Continue (enabled when profile is complete and the period has items) → Confirmation.
5. Back to Dashboard; card shows "Submitted (demo)". Revisiting the return shows "Resubmit".

## UI principles

- **Clarity:** fixed labels "VAT owed (on income)", "VAT saved (on expenses)"; the rule line sits next to the figures, and a line "2 unpaid invoices not counted yet" linking to the Income list **(suggestion)** so missing invoices are not a surprise; every disabled state says why and what to do.
- **Resilience:** figures recompute from stored items on every visit; long party names wrap; double-clicking Continue still creates one submission; storage unavailable shows "Couldn't save in this browser" and stays on the page **(suggestion)**.
- **Access:** disabled Continue's reason is text, not colour; summary rows are real links; one column on narrow screens with the Result first.

## States

| Screen | State | Tester sees / can do |
|---|---|---|
| VAT return | Profile incomplete | Banner + link; Continue disabled "Complete your profile first". |
| VAT return | Empty period | Dashes for all three figures, explanation line, links to Add income / Add expense **(suggestion)**; Continue disabled. |
| VAT return | Refund | "You get back €X", no minus sign. |
| VAT return | Already submitted | "Submitted (demo) on <date>"; button "Resubmit". |
| VAT return | Invalid period | "This period doesn't exist" + link to Dashboard. |
| Confirmation | No submission yet | "Nothing submitted for this period yet" + link to the VAT return. |
| Confirmation | Success | Demo line, period, Result, Back to Dashboard. |

## Connections

| From | To | Notes |
|---|---|---|
| Dashboard deadline card (TFX-04) | `/filing/2026-10` | In. Card shows "Submitted (demo)" after submission. |
| Nav / direct URL | `/filing/[period]` | In. No in-app way to other months until TFX-08. |
| Profile banner "Complete profile" | `/account/profile?from=/filing/[period]` | Out and back. Needs TFX-05 to honour `?from=`, or the tester lands elsewhere (dead end risk). |
| Summary income row | `/transactions/income/[id]` | Out. **Flag:** no return link to the VAT return; tester uses browser Back. Suggest `?from=` here too (would change TFX-02/03). |
| Summary expense row | `/transactions/expenses/[id]` | Out. **Flag:** saving returns to the Expenses list, not the return (TFX-03 behaviour). Same `?from=` suggestion. |
| Empty-period links **(suggestion)** | Add income / Add expense | Out. Same return-path gap. |
| Continue / Resubmit | `/filing/[period]/done` | Out. |
| Confirmation "Back to Dashboard" | `/` | Out. Only exit; no link back to the return **(suggestion: add "View return")**. |
| Invalid period / empty confirmation | Dashboard / VAT return | Out. No dead ends. |

Next step: `/build TFX-06`.
