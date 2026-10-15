Status: Backlog
# TFX-04 — Dashboard

Needs `/spec TFX-04` before build. Map: `docs/information-architecture.md`. Depends on TFX-02 and TFX-03.

## Scope
Home screen: three tiles (total income, total expense, VAT for the current month), a monthly income-and-expenses chart, the next VAT deadline card, a to-do card, and quick actions (Add income, Add expense).

## Decisions (draft)
- Every tile links to the list or filing screen it comes from, and states what it is made of (principle 2).
- VAT tile uses the same wording as the VAT return: owed, saved, result.
- To-do card appears only while the profile is incomplete and links to Profile.
- Deadline card links to the VAT return and shows "Submitted (demo)" after confirmation.
- No Create invoice button.

## Acceptance criteria (draft)
- [ ] Tiles and chart match the transactions list for the same year.
- [ ] Empty state for a new tester with no transactions.
- [ ] Demo note visible.

## Out of scope
Feedback card, language switcher, quarterly deadlines.

## Copy
[copy TBD]
