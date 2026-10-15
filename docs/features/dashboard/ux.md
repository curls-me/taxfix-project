# UX brief — TFX-04 Dashboard (quick)

Requirements come from the ticket (spec agreed 2026-10-15). Items marked *Suggestion* are mine, not agreed.

## Key screen: Dashboard `/`
- **Purpose:** see where I stand in one glance and know the one next step.
- **Order, top to bottom (phone and desktop):** heading + quick actions (Add income, Add expense) → next-step area → three tiles → monthly chart.
- **Next-step area:** profile incomplete → to-do card with the arrow CTA "Complete your profile →" as the primary action, deadline card below with a secondary button. Profile complete → deadline card with "Open VAT return" as primary; a quiet "Profile" link stays.
- **Tiles:** big number, label, one-line "made of" caption; the whole tile is a link. Income/Expenses tiles include unpaid items (match the lists); the VAT tile counts income by payment date (unpaid left out) and expenses by issue date, and its caption "Paid income and expenses of October (demo rule)" says so.
- **Chart:** paired bars per month (income, expenses), legend in words, plus a visually hidden table with the monthly figures.

## Main flow
1. Land on Dashboard, read the to-do or deadline card.
2. Profile incomplete → "Complete your profile →" → save → back to Dashboard (`?from=/`), to-do and CTA gone.
3. Open VAT return → confirm (TFX-06) → back to Dashboard, card reads "Submitted (demo)".
4. Any time: tap a tile to see the rows behind it, or add a transaction and return to see totals update.

## UI principles
- **Clarity:** "VAT owed / VAT saved / Result" exactly as on the VAT return; result in words, never a bare minus. Every placeholder date says "(demo date)".
- **Resilience:** totals read from the same browser store and the same VAT function as the lists and the return, so numbers always agree after edits and reloads; large amounts wrap at narrow widths.
- **Access:** tiles, cards and the CTA are real links with visible focus; the arrow is decorative (the words carry the meaning); colour is never the only way to tell income from expenses; tiles stack in one column on phones.

## States
| Part | Empty | Success |
|---|---|---|
| Tiles | €0.00, caption "No invoices yet" / "No expenses yet" | Totals update after add/edit |
| VAT tile | Owed and saved €0.00, "Nothing to pay" | n/a |
| Chart | "No income or expenses yet. Add your first one to see the chart." | n/a |
| To-do + CTA | Hidden when profile complete (quiet link instead) | Gone after profile save |
| Deadline card | Shown even with no transactions | "Submitted (demo)" from `vat-companion.filings.v1` |

No error states: the dashboard has no inputs.

## Connections
**Out of the dashboard**
| From | To | Back? |
|---|---|---|
| Income tile | `/transactions/income` | Nav "Dashboard" only |
| Expenses tile | `/transactions/expenses` | Nav "Dashboard" only |
| VAT tile, deadline card | `/filing/2026-10` | Confirmation → Dashboard (TFX-06) |
| To-do card, arrow CTA, quiet Profile link | `/account/profile?from=/` | Save returns to `/` (TFX-05 must honour `from`) |
| Add income / Add expense | `/transactions/{income,expenses}/new` | Save/Cancel go to the **list**, not the Dashboard |

**Into the dashboard:** Nav "Dashboard" (every page), product name in the header, Confirmation "Back to Dashboard", Profile save when `from=/`, invalid filing period link (TFX-06).

**Flags**
- Add income/expense from the Dashboard lands on the list after saving (TFX-03 rule). Not a dead end (nav works), but the tester doesn't see the tile update straight away. *Suggestion:* accept for now; a `from=/` return would be a TFX-03 change.
- If TFX-05 ignores `?from=/`, Profile save would not bring the tester back. Check during build.
- No dead ends found: every destination has the main nav.

Next step: `/build TFX-04` (after TFX-05 and TFX-06).
