Status: Backlog
# TFX-01 — App scaffold and first Vercel deploy

Example ticket and first piece of work. Statuses: `Backlog` → `In progress` → `In review` → `Done`.

## Scope
Empty Next.js + TypeScript + Tailwind app with a shared layout (top nav: Dashboard, Transactions, Account), a visible demo note, and typed mock data for one fictional self-employed user. Deployed to Vercel from GitHub.

### Site diagram


## Decisions
- No Taxfix logo or branding; generic product name. (PRODUCT.md, brand commitments.)
- Mock data lives in one file so live features can reuse it.

## Acceptance criteria
- [ ] `npm run build` passes.
- [ ] Each nav item opens a placeholder page.
- [ ] Demo note visible on every page: "Prototype with demo figures. Not tax advice. Not official Taxfix software."
- [ ] Vercel preview link works from the draft PR.

## Out of scope
Any tax logic, forms, or data entry.

## Copy
Demo note as above. Page titles: "Dashboard", "Transactions", "Account".
