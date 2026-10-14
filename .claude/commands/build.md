---
name: build
description: Build one agreed ticket ("/build TFX-NN"): short plan, implement on a branch, push, open a draft PR, update the ticket status.
---

# Build

Arguments: `$ARGUMENTS` (a ticket ID, e.g. `TFX-03`).

## Step 1: Check
Read `tickets/TFX-NN-*.md`. If its status is not `Ready` or it has unresolved open questions, stop and say so: run `/spec` first. Read the feature's `ux.md` only if the ticket needs it. Open only the code files you will change.

## Step 2: Plan (show, don't wait)
Give a plan of at most five lines: screens or components touched, mock data needed, anything risky. Then continue unless something in it is a product decision; if so, ask.

## Step 3: Build
- Branch from up-to-date `main`: `feat/tfx-nn-<slug>`.
- Set the ticket's first line to `Status: In progress`.
- Implement only the acceptance criteria. Reuse the shared layout and mock data; no new abstractions.
- All figures are placeholders and the UI shows the demo note (see CLAUDE.md).
- Run `npm run build` once before pushing; fix errors, don't re-run otherwise.

## Step 4: Hand off
- Set the ticket to `Status: In review` and tick the met criteria.
- Commit, push, open a **draft PR** titled `TFX-NN: <title>`. Stop; Marina merges.
- Reply with the PR link, the Vercel preview link once it appears, and any criterion not met.
