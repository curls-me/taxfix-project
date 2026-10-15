# UX brief — TFX-03 Add income and add expense

Ticket: `tickets/TFX-03-add-income-expense.md`. Items marked **(suggestion)** are mine, not agreed in the ticket.

## Key screens

One form, two modes. Add income and Add expense look the same except for the party label (Client / Supplier), the payment date (income only) and the 0% VAT reason (expense only). Edit expense reuses it.

**Add income / Add expense / Edit expense** (`/transactions/{income,expenses}/new`, `/transactions/expenses/[id]`)
- Purpose: record or correct one transaction.
- Top to bottom: title, document drop zone (visual only, says "Demo: the file is not read or stored"), then Invoice number, Issue date, Client/Supplier, Description, Category, Payment date (income), Net amount, VAT rate, VAT amount, Gross amount, and the read-only period line.
- Main action: **Save** (primary). **Cancel** (secondary link). Edit expense also keeps **Delete** from TFX-02, set apart from Save.
- Drop zone sits first because the reference screens start with the document. **(suggestion)** Putting it first without reading it may suggest autofill. The helper text should say plainly that fields are filled by hand.

## Main flow

1. Tester starts from a list tab or the Dashboard ("Add income" / "Add expense").
2. Fills the form. Net and rate drive VAT and gross live.
3. Sees the period line update as the date changes: "Counts toward October 2026 (demo rule…)", or "Not counted until paid".
4. Optionally overwrites VAT or gross. An "edited" marker and "Reset to calculated" appear.
5. Decision: Save → validation. Errors stay on the form; success returns to the matching list with the new row visible and the tab total updated.
6. Cancel at any point returns to the list. **(suggestion)** If fields were filled, ask once "Discard what you entered?" so a mis-tap does not lose work.

## UI principles

**Clarity**
- Use plain labels with an example hint where helpful ("Net amount, before VAT").
- The VAT rate dropdown shows "19% (standard)", "7% (reduced)" and "0%".
- The period line is always visible, so the working is shown (principle 2).
- Errors name the field and the fix: "Enter a net amount, for example 120.00".
- The 0% expense note is short and plain, with no tax vocabulary [copy TBD].

**Resilience**
- Nothing is lost on a validation error; the form keeps all values and scrolls to the first error.
- Reset to calculated is always one click. Changing net or rate clears an override, and a one-line notice says so **(suggestion)** so it is not a surprise.
- Double-click on Save creates one item (disable Save while saving).
- Long party or description text wraps and is not cut off in the form.
- Reopening an item shows saved overrides as entered.

**Access**
- Every field has a visible label and keyboard-reachable controls; Enter submits, Esc does not discard silently.
- Errors are text, not colour alone, and are linked to their field.
- Narrow screens use one column with Save pinned at the bottom of the form, not floating over fields **(suggestion)**.
- Amounts use a number-friendly input; two decimals; euro symbol shown.

## States

| Screen | State | What the tester sees / can do |
|---|---|---|
| Form | Fresh | Empty fields, VAT 19% preselected **(suggestion)**, period line "Not counted until paid" (income) or "Choose an issue date" (expense). |
| Form | Validation error | Inline message per required field; summary line at the top: "Please fix 2 fields to save". Save stays available. |
| Form | Bad amount | "Net amount must be a number above 0" **(suggestion: ticket says reject negative; 0 is unspecified)**. |
| Form | 0% expense, no reason | Reason field shown and required; blocked until chosen. |
| Form | Overridden VAT/gross | "edited" marker + "Reset to calculated". |
| Form | Storage unavailable | "Couldn't save in this browser. Your entries are still here." Retry stays available. **(suggestion)** |
| Form | Success | Redirect to the list; row appears with a brief "Income added" / "Expense added" confirmation. |
| Edit expense | Item not found | "This expense no longer exists" with link to the list (e.g. deleted in another tab). |
| Edit expense | Delete | Confirm text from TFX-02: "Are you sure? This action cannot be undone". |
| Lists | Empty | TFX-02 empty lines now link to the live add form. |

## Flagged for Marina (would change the ticket)

- Amount of 0 is unspecified; I suggest rejecting it (above).
- The ticket lists the drop zone as "visual only". If testers expect autofill, the helper text above is the only guard; consider whether the zone should be last on the form.
- Edit expense TFX-02 labelled fields "same fields TFX-03 will use", while TFX-03 adds invoice number, party and overrides to the edit. This ticket's AC covers it; the build touches the TFX-02 screen.

Next step: `/build TFX-03`.
