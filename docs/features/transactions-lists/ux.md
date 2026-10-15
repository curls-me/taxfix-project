# UX brief — TFX-02 Transactions: income and expenses lists

Agreed requirements come from the ticket; items marked *Suggestion* are mine and not yet agreed.

## Key screens

**Transactions, Income tab**
- Purpose: see what came in during 2026.
- Shows: tab switch (Income / Expenses), "2026" label, total for the year, list of rows (client, date, total amount).
- Main action: open a row.
- *Suggestion:* the total sits above the list with a short caption, "Sum of the rows below", so testers can check it (principle: show the working).

**Transactions, Expenses tab**
- Same layout as Income, with vendor, date, category, amount per row.

**Income detail**
- Purpose: check one income item and say when it was paid.
- Shows: client, invoice date, net, VAT, total (read-only), payment date field, and the resulting VAT period ("Counts toward Q3 2026") with a demo/placeholder note.
- Main action: Save payment date.

**Expense detail (edit)**
- Purpose: correct or remove one expense.
- Shows: description, date, net, VAT rate, category; total and VAT update as values change or on save.
- Main actions: Save changes (primary), Delete (secondary, visually apart).

## Main flow
1. Open Transactions, land on Income, see the 2026 total and rows.
2. Switch tabs if needed.
3. Open a row.
4. Income: set a payment date, save, read which VAT period it counts toward, go back.
   Expense: edit fields and save, or delete and confirm. Either way, return to the list and see the updated total.

Decision point: delete asks "Are you sure? This action cannot be undone" before anything is removed.

## UI principles
- **Clarity:** plain labels ("Paid on", not "value date"); the VAT period note explains in one line why the payment date matters. Validation messages say what to fix ("Enter an amount greater than 0").
- **Resilience:** long client or vendor names truncate in the list and wrap on the detail page. Entered values stay in the form after a validation error. Delete cannot be triggered by a double click: the confirm must be answered.
- **Access:** tabs, rows, form fields and the confirm are fully keyboard-operable with visible focus; rows are real links/buttons; amounts are right-aligned and readable at narrow widths, where list rows stack vendor/date above amount; contrast meets sensible defaults.

## States
| Screen | Empty | Error | Success |
|---|---|---|---|
| Income list | "No income yet for 2026." + link to add flow (placeholder route until TFX-03) | n/a | n/a |
| Expenses list | "No expenses yet for 2026." + link to add flow | n/a | Row removed after delete, total updates |
| Income detail | n/a | Payment date missing or invalid: inline message, nothing saved | Date saved, VAT period note updates, short "Saved" confirmation |
| Expense detail | n/a | Required field empty or amount not a positive number: inline message per field, form values kept | "Saved" confirmation, back to list with updated total |
| Delete confirm | n/a | n/a | Expense removed, return to Expenses list |

*Suggestion:* a payment date outside 2026 shows a gentle inline warning ("This date is outside 2026") and still saves. This is not in the ticket; if you want it blocked or dropped, that is a spec change.

## Flags
- The copy "Are you sure? This action cannot be undone" does not name what is deleted. *Suggestion:* include the expense description in the dialog. Copy change only; ticket unchanged.
- Delete is removed in this browser only; mock rows will return for a fresh visitor. No UI promise beyond the demo note is needed.

Next step: `/build TFX-02`.
