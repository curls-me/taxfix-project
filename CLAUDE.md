# Taxfix prototype — CLAUDE.md

Short on purpose. If something only matters sometimes, it doesn't belong here.

## What we're building

An interview case-study prototype for Taxfix: a web app that helps self-employed people in Germany prepare VAT returns and yearly tax submissions (similar to Accountable). It is a demo to show and test with users, not production software. Product detail: `PRODUCT.md`.

Goal of the set-up: go from a short discovery to a shareable prototype fast and cheaply.

## Working agreements

- **Branch, never `main`.** Work on a branch, push it, open a **draft PR**, then stop. Marina reviews and merges on GitHub.
- **Spec before build.** Order: `/problem-definition` → `/spec` → `/ux-design` → `/build` → `/verify`. Skip a step only if Marina says so. Each feature's docs live in `docs/features/<slug>/`.
- **Several tickets at once:** `/pipeline TFX-NN TFX-NN ...` runs them all the way to local verification, with one stop for product decisions, and ends in one draft PR.
- **Verify before push.** `/verify` clicks through every acceptance criterion locally; nothing is pushed until Marina says "push".
- **Quick mode for the live interview.** The prototype is prepared in advance, then improved or extended live. Add `quick` to any command (e.g. `/spec quick vat-overview`): all questions in one message, half-page outputs.
- **Tickets are local.** One file per ticket in `tickets/` (`TFX-01-<slug>.md`, status on the first line: Backlog, In progress, In review, Done; `/spec` adds a "Spec agreed" line when ready to build). Linear is not connected.
- **Sessions end with `/decision-log`**, which appends to `local docs/decision-log.md`.
- **Ask when unsure** whether Marina wants discussion or action. One line.

## Git flow

- `main` = what's live. A branch = Claude's draft copy. Push = upload the draft to GitHub (Vercel builds a preview). Draft PR = request to merge. Merge = Marina, on GitHub. Close-out (`/git-closeout`) = sync the laptop with GitHub and delete the branch.
- Every session starts with `git fetch`; if local `main` is behind `origin/main`, fast-forward it before branching.

## Token efficiency (applies to every session)

- Read `PRODUCT.md` and `docs/company-context.md` first; open anything else only when needed.
- Open a file in `docs/reference-screens/` only when a ticket or Marina names it (images are expensive).
- Full company research lives outside the repo: `~/Documents/01_Career/01_Job_Search/2026/Company_Research/Taxfix`. Read it only when asked.
- If a task can be done by Marina by hand in a minute, or by a free AI (Gemini, Perplexity, GPT), say so and offer a ready-to-paste prompt instead of doing it.
- Don't re-run tests or re-verify unless code changed. Don't launch subagents or multi-agent workflows without asking (running `/pipeline` counts as asking).
- Sonnet for building and drafts; Opus only for the spec and plan.

## Stack

- Next.js + TypeScript + Tailwind, deployed to Vercel from GitHub (every push builds a preview).
- **No database.** Typed mock data in the repo; browser localStorage for what a tester enters.
- **Docker exception:** plain Node for local dev, because this is not production code.

## Principles

- **Prototype honesty.** All numbers and tax rules are placeholders. Never present output as real tax advice; show a visible "demo" note in the UI.
- **No real personal data.** Use fictional users and invoices only. No secrets in the repo (`.env*` is gitignored).
- **Transparent by default.** Show why a number is what it is (which invoices, which rate) so testers can check it.
- **Keep it small.** No abstractions, extra pages or tests beyond what the current ticket needs.

## Testing

**Test exception:** all tax logic is placeholder, so no automated tests are required. `npm run build` must pass before a PR. If a ticket ever adds real calculation logic, it gets unit tests.
