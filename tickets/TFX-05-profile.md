Status: Backlog
# TFX-05 — Settings: Profile

Needs `/spec TFX-05` before build. Map: `docs/information-architecture.md`. Depends on TFX-01.

## Scope
Settings page (list with Profile only) and a Profile form with the few details needed to file: name, address, tax number, filing period (monthly). Saved to browser storage. Completing it clears the to-do on the dashboard and the banner on the VAT return.

## Decisions (draft)
- Three to four required fields, no more.
- After saving, return to the page the tester came from.
- Fictional example values shown as placeholders; no real tax numbers.

## Acceptance criteria (draft)
- [ ] Profile is "complete" only when all required fields are filled.
- [ ] Completeness drives the dashboard to-do and the VAT return banner.
- [ ] Settings shows no dead links.

## Out of scope
Billing, subscription, vouchers, privacy settings, close account, change email.

## Copy
[copy TBD]
