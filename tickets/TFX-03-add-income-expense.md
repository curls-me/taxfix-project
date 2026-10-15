Status: Backlog
# TFX-03 — Add income and add expense

Needs `/spec TFX-03` before build. Map: `docs/information-architecture.md`. Depends on TFX-02.

## Scope
One shared form for adding income and adding an expense: VAT period, invoice number, issue date, party (client or supplier), description, category, net amount, VAT rate, VAT amount, gross amount. Income also has a payment date. Saved to browser storage; save returns to the matching list.

## Decisions (draft)
- Document upload is a visual drop zone only; the file is not stored or read.
- VAT amount and gross are calculated from net and rate, and the user can overwrite them (principle 3).
- 0% VAT on an expense asks for a reason, with a short plain-language note.
- Payment date picks the VAT period for income.

## Acceptance criteria (draft)
- [ ] Required fields are marked and block saving when empty.
- [ ] A saved transaction appears in the list and in the dashboard totals.
- [ ] Cancel returns without saving.

## Out of scope
Reading data from the uploaded document, bank import, Create invoice.

## Copy
[copy TBD]
