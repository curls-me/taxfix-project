# UX brief — TFX-06 VAT return and confirmation

Ticket: `tickets/TFX-06-vat-return.md` (spec drafted, not yet agreed). Items marked **(suggestion)** are mine, not in the ticket.

## Key screens

**VAT return** (`/filing/[period]`): know what I owe for the month and file it.
- Top to bottom: title "VAT return, October 2026", filing window line, profile banner (only while incomplete), three figures (VAT owed, VAT saved, Result), summary in two groups (Income counted / Expenses counted, each row: party, date, VAT, link), Continue.
- Result is the largest figure and worded "You pay / You get back / Nothing to pay". **(suggestion)** Show the sum under it ("€57.00 owed − €41.89 saved") so the working is visible without scrolling.
- Main action: **Continue** (primary, bottom). Disabled reason shown as text right under it.

**Confirmation** (`/filing/[period]/done`): know it is done, and that it is a demo.
- "Demo only. Nothing was sent to the tax office." first, then period and Result as submitted.
- Main action: **Back to Dashboard**.

## Main flow

1. Dashboard deadline card → VAT return for the period.
2. Profile incomplete? Banner → Profile → save returns here; banner gone.
3. Tester checks figures, opens a summary row to fix an item, returns; figures update.
4. Decision: Continue (enabled when profile is complete and the period has items) → Confirmation.
5. Back to Dashboard; card shows "Submitted (demo)".

## UI principles

- **Clarity:** fixed labels "VAT owed (on income)", "VAT saved (on expenses)"; every disabled state says why and what to do; a short note "Unpaid invoices are not counted yet" **(suggestion)** above the income group, since unpaid income missing from the return will surprise testers.
- **Resilience:** figures recompute from stored items on every visit; long party names wrap; Continue twice still creates one submission; storage unavailable shows "Couldn't save in this browser" and stays on the page **(suggestion)**.
- **Access:** disabled Continue still readable and its reason is text, not colour; summary rows are real links; one column on narrow screens with the Result figure first.

## States

| Screen | State | Tester sees / can do |
|---|---|---|
| VAT return | Profile incomplete | Banner + link; Continue disabled "Complete your profile first". |
| VAT return | Empty period | Dashes for all three figures, explanation line, links to Add income / Add expense **(suggestion)**; Continue disabled. |
| VAT return | Refund | "You get back €X", no minus sign. |
| VAT return | Already submitted | "Submitted (demo) on <date>"; button "Submit again (demo)" (open question in ticket). |
| VAT return | Invalid period | "This period doesn't exist" + link to Dashboard. |
| Confirmation | Opened directly without submitting **(suggestion)** | "Nothing submitted for this period yet" + link to the VAT return. |
| Confirmation | Success | Demo line, period, Result, Back to Dashboard. |

## Flagged (would change the ticket)
- Confirmation reached by URL without submitting is not covered by the ticket; I suggest the state above.

Next step: `/build TFX-06`.
