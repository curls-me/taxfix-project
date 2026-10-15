Status: Done
# TFX-01 — App scaffold and first Vercel deploy

First piece of work. Statuses: `Backlog` → `In progress` → `In review` → `Done`. Full map: `docs/information-architecture.md`.

## Scope
Next.js + TypeScript + Tailwind app with a shared layout (top nav: Dashboard, Transactions, Account), a visible demo note, empty placeholder pages for every route in the site diagram, and typed mock data for one fictional self-employed user. Deployed to Vercel from GitHub.

### Site diagram
```
/                                   Dashboard
/transactions                       → redirects to income tab
  /transactions/income              Income list
  /transactions/income/new          Add income
  /transactions/income/[id]         Income detail
  /transactions/expenses            Expenses list
  /transactions/expenses/new        Add expense
  /transactions/expenses/[id]       Edit expense
/filing/[period]                    VAT return (period e.g. 2026-10)
  /filing/[period]/done             Confirmation
/account                            Settings
  /account/profile                  Profile
```
Nav links: Dashboard → `/`, Transactions → `/transactions`, Account → `/account`.

## Decisions
- Generic product name "VAT Companion", held in one constant. No Taxfix logo or branding. (PRODUCT.md, brand commitments.)
- Nav label "Account", page title "Settings". Only Profile is built; billing, subscription, vouchers and close account are left out.
- English UI only; no language switcher.
- Create invoice is not in the first build. "Create new" on the income list will show "Coming soon" (ticket TFX-07).
- Monthly VAT filing for the whole prototype.
- Mock data in one file (`data/mock.ts`): one fictional user (freelancer, monthly filing, tax year 2026) and about 12 transactions. Each has date, counterparty, description, net, VAT rate (19 / 7 / 0 %), type (income / expense), payment status, and VAT period. Fictional names only.
- Nav works at phone width.
- Placeholder pages show only the title and "Coming soon".
- Connecting the GitHub repo to Vercel is a one-time step Marina does.

## Acceptance criteria
- [x] `npm run build` passes.
- [x] Every route in the site diagram opens a placeholder page; dynamic routes work with any id.
- [x] Each nav item goes to its page and the current page is marked.
- [x] Demo note visible on every page: "Prototype with demo figures. Not tax advice. Not official Taxfix software."
- [x] Mock data file is typed and contains no real people or invoices.
- [ ] Vercel preview link works from the draft PR.

## Out of scope
Any tax logic, forms, data entry, real content on the pages (see TFX-02 to TFX-06).

## Copy
Demo note as above. Page titles: "Dashboard", "Transactions", "Settings", "VAT return". Placeholder line: "Coming soon".

Spec agreed 2026-10-15.
