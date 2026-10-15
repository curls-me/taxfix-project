Status: Backlog
# TFX-06 — VAT return and confirmation

Needs `/spec TFX-06` before build. Map: `docs/information-architecture.md`. Depends on TFX-02, TFX-03 and TFX-05. The first ticket that adds calculation logic, so it gets unit tests (see CLAUDE.md).

## Scope
Monthly advance VAT return for one period. Shows the filing window, a profile banner while incomplete, a summary of the income and expense documents in the period, and VAT owed, VAT saved and Result. Continue leads to a confirmation screen; the dashboard card then shows "Submitted (demo)".

## Decisions (draft)
- Monthly only; period in the URL (e.g. `2026-10`).
- VAT owed = VAT on income paid in the period; VAT saved = VAT on expenses in the period; Result = owed − saved. Placeholder rules, labelled demo.
- Summary lists the invoices behind each number (principle 2) and links to edit them.
- Continue is disabled until the profile is complete and the period has at least one transaction.
- Confirmation says nothing was sent to the tax office.

## Acceptance criteria (draft)
- [ ] Result equals owed minus saved for the transactions in the period.
- [ ] Each figure can be traced to its transactions.
- [ ] Continue disabled and enabled as described.
- [ ] Unit tests for the calculation.
- [ ] Empty period shows dashes and an explanation.

## Out of scope
Quarterly filing, real submission, tax advice, annual return.

## Copy
Confirmation: "Demo only. Nothing was sent to the tax office." Rest [copy TBD].
