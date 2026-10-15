# Information architecture

Agreed 2026-10-15. Based on `docs/reference-screens/01–09` plus the VAT filing screen (not stored in the repo). Reference screens are inspiration, not a spec.

## Product loop

**Record** income and expenses → **review** them in Transactions → **file** the monthly VAT return. Profile is the gate between reviewing and filing.

## Site map

```
Dashboard                      /
├─ Tax submissions card ─────► VAT return            /filing/2026-10
├─ To-do card ───────────────► Settings › Profile    /account/profile
├─ Totals (income/expense/VAT) ► Transactions
├─ Add income ───────────────► Add income            /transactions/income/new
└─ Add expense ──────────────► Add expense           /transactions/expenses/new

Transactions                   /transactions  (→ income tab)
├─ Income tab                  /transactions/income
│   ├─ Add existing ─────────► Add income
│   ├─ Create new ───────────► "Coming soon" (Create invoice is a later ticket)
│   └─ row ──────────────────► Income detail         /transactions/income/[id]
└─ Expenses tab                /transactions/expenses
    ├─ Add manually / Upload ► Add expense
    └─ row ──────────────────► Edit expense          /transactions/expenses/[id]

Settings (nav label "Account")  /account
└─ Profile                     /account/profile

VAT return                     /filing/[period]
├─ To-do banner ─────────────► Profile
├─ Summary edit ─────────────► Transactions
└─ Continue ─────────────────► Confirmation          /filing/[period]/done
```

## Screens

| Screen | Job | Key content | Next step |
|---|---|---|---|
| Dashboard | See where I stand | Income / expense / VAT tiles, monthly chart, next deadline, to-dos | Open the VAT return or add a transaction |
| Transactions › Income | Review what I earned | Total, search, list (client, date, invoice no., status, gross) | Add or open a row |
| Transactions › Expenses | Review what I spent | Total, search, list (supplier, date, status, gross) | Add or open a row |
| Income detail | Check one invoice, set payment date | Invoice data, payment date, net / VAT / total | Save |
| Add income / Add expense | Record one transaction | Document drop, VAT period, party, category, net / VAT rate / gross | Save or cancel |
| Edit expense | Correct one | Same form, VAT-reason note, Delete | Save or delete |
| Settings › Profile | Complete the details needed to file | Name, tax number, address, filing period | Save, back to wherever the user came from |
| VAT return | Know what I owe and file | Filing window, profile banner, summary, VAT owed / VAT saved / Result | Continue (disabled until profile is complete and there is something to file) |
| Confirmation | Know it is done (demo) | "Demo only, nothing was sent to the tax office" | Back to Dashboard, card shows "Submitted (demo)" |

## Rules that cut across screens

- **Payment date decides the VAT period.** Show this wherever a period is assigned. (Principle 2: show the working.)
- **Monthly filing for the whole prototype.** The reference VAT screen also shows quarterly; we do not build that.
- **Same wording everywhere:** VAT owed (on income), VAT saved (on expenses), Result = owed − saved. No bare minus signs.
- **Income and expense forms share one form component; both lists share one list component.**
- **Profile completeness is real:** the VAT return's Continue stays disabled until the required profile fields are filled (stored in the browser).
- **Demo note on every page.** All data fictional.

## Not in the prototype

Create invoice (later ticket), quarterly filing, billing, subscription, vouchers, close account, language switcher, real submission to ELSTER.
