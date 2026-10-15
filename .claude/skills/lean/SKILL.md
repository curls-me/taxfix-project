---
name: lean
description: Smallest complete change for this prototype. Apply on every code change (used by /build); also when Marina says "lean", "simpler", "too much code".
---

# Lean

Adapted from Ponytail (MIT, https://github.com/DietrichGebert/ponytail), simplified for a demo prototype.

The best code is the code not written. Build every acceptance criterion with the least new code.

## Before you write

Read the ticket and the files it touches. List what the change must reach (pages, `components/`, `lib/`, `data/mock.ts`). That is the scope; nothing else.

## The ladder: stop at the first step that works

1. **Needed for an acceptance criterion?** If not, skip it and name it in one line.
2. **Already in the repo?** `components/` (`TransactionList`, `Placeholder`, `Nav`), `lib/transactions.ts` (`useTransactions` for storage), `lib/config.ts`, `data/mock.ts`. Reuse it the way it is used now.
3. **Browser, React, Next.js or Tailwind does it?** E.g. `<input type="date">`, `Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })`, `<details>`, `<dialog>`, form `required`.
4. **Otherwise the minimum code that works.** No new npm package without asking Marina.

- No abstractions, options, config or "for later" code.
- Comment only the why, in one line.

## Placeholder tax rules

Every placeholder rule or figure gets one comment:
`// shortcut: <what is simplified>, <what real rule replaces it>`
Example: `// shortcut: flat 19% VAT, needs 7% and 0% rates for real returns`.

## Never cut

- The demo note and "not tax advice" framing.
- Showing why a number is what it is (which invoices, which rate).
- Fictional data only.
- Basic accessibility: labels on inputs, buttons not divs, keyboard works.
- Safe reading of localStorage (bad or missing data must not crash the page).

## Tests

Follow CLAUDE.md: none for placeholder logic; real calculation logic gets a unit test.

## Reply

End with one line: what you skipped or did not check, and any risk.
