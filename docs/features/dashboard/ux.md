# UX brief — TFX-04 Dashboard (quick)

Draft: the ticket has no "Spec agreed" line yet; open questions are in the ticket. Items marked *Suggestion* are mine, not agreed.

## Key screen: Dashboard `/`
- **Purpose:** see where I stand in one glance and know the one next step.
- **Order, top to bottom (phone and desktop):** heading + quick actions (Add income, Add expense) → next-step area (to-do card if profile incomplete, else deadline card first) → three tiles → monthly chart.
- **Main action:** "Open VAT return" on the deadline card. *Suggestion:* while the profile is incomplete, the to-do card is the primary action and the deadline button is secondary, so there is still one clear next step.
- **Tiles:** big number, label, one-line "made of" caption; the whole tile is a link.
- **Chart:** paired bars per month (income, expenses), legend in words, plus a visually hidden table with the monthly figures.

## Main flow
1. Land on Dashboard, read the to-do or deadline card.
2. Profile incomplete → Go to profile → save → back to Dashboard, to-do gone.
3. Open VAT return → confirm (TFX-06) → back to Dashboard, card reads "Submitted (demo)".
4. Any time: tap a tile to see the rows behind it, or add a transaction and return to see totals update.

## UI principles
- **Clarity:** "VAT owed / VAT saved / Result" exactly as on the VAT return; result in words ("you pay" / "you get back"), never a bare minus. Every placeholder date says "(demo date)".
- **Resilience:** totals read from the same browser store as the lists, so edits and reloads stay consistent; large amounts don't overflow tiles (number wraps under label at narrow widths).
- **Access:** tiles and cards are real links with visible focus; colour is never the only way to tell income from expenses (legend labels, patterns or position); tiles stack in one column on phones.

## States
| Part | Empty | Error | Success |
|---|---|---|---|
| Tiles | €0.00 with caption "No invoices yet" / "No expenses yet" | n/a | Totals update after add/edit |
| VAT tile | Owed and saved €0.00, Result "Nothing to pay" | n/a | n/a |
| Chart | Message "No income or expenses yet. Add your first one to see the chart." | n/a | n/a |
| To-do card | Hidden when profile complete | n/a | Disappears after profile save |
| Deadline card | Shown even with no transactions | n/a | "Submitted (demo)" after confirmation |

## Flags
- Empty state is hard for testers to reach (mock data always loads, income can't be deleted). See open question in the ticket.

Next step: `/build TFX-04` once the spec is agreed.
