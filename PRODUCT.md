# Product

## Platform

web (responsive; prototype deployed on Vercel for user testing)

## Users
Self-employed people in Germany: freelancers, Kleinunternehmer and small business owners. They are not tax experts, they do their own bookkeeping or avoid it, and they find taxes a burden and want understandable automation. [To validate in discovery: who exactly the tester group is.]

## Product Purpose
Help the self-employed prepare VAT returns (Umsatzsteuer-Voranmeldung) and their yearly tax submission without tax knowledge: record income and expenses, see what is owed and when, and be guided to a submission-ready result. This is an interview case-study prototype for Taxfix, to show a way of working and a product direction, not a production system.

## Positioning
Similar in scope to Accountable (accountable.de). Taxfix has launched its own German self-employed product (March 2026), so this prototype explores how that experience could be clearer and more trustworthy, not whether it should exist. Competitors named in public Taxfix materials: Accountable, Sevdesk, Lexware, Kontist.

## Operating Context
Prototype with no backend or database: mock data in the repo and browser-only storage for tester input. No real submission to ELSTER or any authority. Short time box; token-efficient set-up. The pipeline is problem definition → UX design → spec → build.

## Capabilities and Constraints
- Web app on Next.js, hosted on Vercel; every change gets a shareable preview link.
- All tax figures, rates and deadlines are placeholders until a tax-logic ticket says otherwise.
- Reference screens (dashboard, income, expenses, invoices, account) are in `docs/reference-screens/`, treated as inspiration, not as a spec.
- Company background: `docs/company-context.md` (public facts only).

## Brand Commitments
Prototype for Taxfix; no Taxfix logos, branding or marks are used or implied. Not official Taxfix software.

## Evidence on Hand
Public company facts, the reference screens, and one industry note (`industry news/`, local only). No user research, no usage data, no testimonials. None may be fabricated.

## Product Principles
1. A tester should understand what they owe and why, without tax vocabulary.
2. Show the working: which invoices and expenses make up a number.
3. Everything the system infers is editable by the user.
4. Placeholder numbers are always labelled as demo; never imply real tax advice.
5. Fewer screens, one clear next step per screen.

## Accessibility & Inclusion
Sensible defaults (readable contrast, keyboard use, plain language). English UI copy.
