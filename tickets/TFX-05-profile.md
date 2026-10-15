Status: In progress
# TFX-05 — Settings: Profile

Map: `docs/information-architecture.md`. Depends on TFX-01. Feeds TFX-04 (dashboard to-do) and TFX-06 (VAT return banner, Continue button).

## Scope
Settings page (`/account`, nav label "Account") listing one item, Profile. Profile form (`/account/profile`) with the few details needed to file: full name, tax number, business address, and filing period shown as "Monthly" (fixed). Saved to browser storage. A complete profile clears the dashboard to-do and the VAT return banner and lets Continue on the VAT return work.

### Site diagram
- Account (`/account`) → Profile (`/account/profile`) → back to Account
- Dashboard to-do card and Dashboard arrow CTA → Profile (`?from=/`) → back to Dashboard
- VAT return banner → Profile (`?from=/filing/2026-10`) → back to VAT return

## Decisions
- Required fields: full name, tax number, address (street and number, postcode, city). Reason: the ticket caps it at three to four, and these are what a filing form asks for.
- Filing period is shown read-only as "Monthly" with a short note, not a field. Reason: the prototype only builds monthly filing (IA rule).
- Profile is "complete" when every required field holds non-blank text. One shared check (`isProfileComplete`) is used by Profile, Dashboard and VAT return. Reason: one rule, no drift between screens.
- Light format check only: postcode is 5 digits; tax number is 10–13 digits once spaces and slashes are removed. Reason: catches typos without pretending to validate real tax numbers.
- Return-to: pages linking to Profile add `?from=<path>`; Save goes back there. Only internal paths starting with `/` are accepted; anything else, or no `from`, returns to `/account`. Reason: ticket decision; the check stops the link being used to send testers to another site.
- Saving with fields missing is blocked with inline messages. Nothing entered is lost. Reason: a half-filled profile would never clear the to-do, so partial saves add confusion.
- Fields start empty (no pre-filled values) but show fictional example text as input placeholders: "Max Mustermann", "12/345/67890", "Musterstr. 1", "10115", "Berlin". Reason: testers see the expected format; the to-do and banner clearing is part of the demo story; no real personal data.
- Address is three fields: street and number, postcode, city. Reason: matches German forms and allows the postcode check.
- Cancel link returns to `from` (or `/account`) without saving. Reason: a way out without losing the place.
- Dashboard links to Profile twice, both with `?from=/`: the to-do card and an arrow CTA (TFX-04 builds both). Reason: Marina's call; makes the gate easy to find.
- Stored in localStorage under `vat-companion.profile.v1`, next to the transactions key. Reason: same pattern as TFX-02/03.

## Acceptance criteria
- [ ] Account page lists Profile only, with a status ("Complete" / "Missing details"); no other links.
- [ ] Profile shows name, tax number, street, postcode, city, and read-only "Filing period: Monthly".
- [ ] Required fields are marked; saving with any blank or badly formatted field is blocked with an inline message and keeps what was typed.
- [ ] Save stores the profile in the browser; it survives a reload and pre-fills the form when reopened.
- [ ] Save returns to the `from` page (Dashboard or VAT return), or to Account if none or not an internal path.
- [ ] Profile counts as complete only when all required fields are filled; this is the single check used by TFX-04 and TFX-06.
- [ ] After a complete save, the dashboard to-do and the VAT return banner are gone (verified once TFX-04/06 exist).
- [ ] Demo note visible; `npm run build` passes.

## Out of scope
Billing, subscription, vouchers, privacy settings, close account, change email, quarterly filing, real tax-number validation, more than one profile.

## Copy
- Account list item: "Profile" — "Details needed to file your VAT return" — status "Complete" / "Missing details".
- Page intro: "We need these details before you can file. Demo only: use fictional data."
- Filing period: "Monthly (the only option in this demo)".
- Errors: "Please enter your name" / "Please enter your tax number" / "Tax number should have 10 to 13 digits" / "Postcode should have 5 digits".
- Buttons: "Save" / "Cancel". Saved confirmation: [copy TBD]
- Placeholders: "Max Mustermann", "12/345/67890", "Musterstr. 1", "10115", "Berlin". Field labels: [copy TBD]

Spec agreed 2026-10-15.
