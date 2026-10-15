# Pipeline decisions: TFX-05, TFX-06, TFX-04, TFX-07

Temporary file. Fill in the **Your answer** lines (leave blank = accept my recommendation). I fold the answers into the four tickets and delete this file once we agree.

Build order (recommended): **TFX-05 → TFX-06 → TFX-04 → TFX-07**
Why: the dashboard's VAT tile needs the VAT calculation defined in TFX-06.

Your answer on build order:

## Resolved by me (tell me if you object)

- One stored record per filed month (`vat-companion.filings.v1`, from TFX-06); the dashboard reads it for "Submitted (demo)".
- One profile-complete check (from TFX-05), used by the dashboard to-do and the VAT return banner.
- Links to Profile carry a "return to this page" path.
- Income counts by payment month; expenses by issue month.
- Profile blocks saving until every required field is filled (postcode 5 digits, tax number 10–13 digits).
- Result reads "You pay / You get back / Nothing to pay", no minus sign.
- With mock data, October = €57.00 owed, €41.89 saved, €15.11 to pay.

## TFX-05 Profile

**1. Start empty or pre-filled?**
Recommend: empty, so testers see the dashboard to-do and VAT return banner disappear once they fill it in.
Your answer:

**2. One address field or three (street, postcode, city)?**
Recommend: three, matching German forms.
Your answer:

**3. Cancel link on Profile?**
Recommend: yes, goes back without saving.
Your answer:

## TFX-04 Dashboard

**4. Do unpaid invoices count in the Income tile?**
Recommend: yes, so it matches the Income list total. The VAT tile counts paid income only and says so in its caption.
Your answer:

**5. Which month is "current"?**
Recommend: fixed October 2026, deadline shown as "10 Nov 2026 (demo date)", so the demo looks the same on any test day.
Your answer:

**6. Empty state (not reachable with mock data)?**
Recommend: build it anyway (small), no "start empty" switch.
Your answer:

## TFX-06 VAT return

**7. Submit a month again?**
Recommend: yes, button becomes "Submit again (demo)".
Your answer:

**8. Previous/next month links?**
Recommend: leave out, keeps it one PR.
Your answer:

**9. Add a test runner (Vitest) for the calculation?**
Recommend: no. Tax logic is placeholder (test exception in CLAUDE.md); a new dependency is extra scope. `npm run build` must pass.
Your answer:

## TFX-07 Create invoice

**10. Build it now?** (the ticket asked for a one-line reason first)
Recommend: yes. Reason: "the invoice goes in once and flows straight into Income and the VAT return."
Your answer:

**11. VAT rate per invoice or per line item?**
Recommend: per invoice, so lists, totals and the VAT return work unchanged.
Your answer:

**12. Profile incomplete when creating an invoice?**
Recommend: warn with a "Complete your profile" link, still allow saving.
Your answer:

**13. Show due date on the Income list?**
Recommend: no; only on the invoice and its detail page.
Your answer:

**14. Keep the invoice draft while the tester goes to Profile and back?**
Recommend: yes, for the browser session.
Your answer:

## Anything else

Notes, extra changes, things I missed:
