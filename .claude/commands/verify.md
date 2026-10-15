---
name: verify
description: Click through one or more built tickets in the local app and check every acceptance criterion ("/verify TFX-NN [TFX-NN ...]"). Runs before anything is pushed.
---

# Verify

Arguments: `$ARGUMENTS` (one or more ticket IDs). Runs on the current feature branch, after `npm run build` has passed. Never pushes.

## Step 1: Prepare
- Read each ticket's acceptance criteria and the "Screens" or "Flow" section of its `docs/features/<slug>/ux.md`. No other docs.
- Start the dev server: `preview_start` with `dev`. If it fails, show the error from `preview_logs` and stop.

## Step 2: Click through
For each criterion, in the built-in browser:
- Do what a tester would do (open the page, fill the form, click the button) with fictional data only.
- Check the result on the page (`read_page`), plus `read_console_messages` for errors.
- Empty states: clear browser storage (`localStorage.clear()`, then reload) and check again.
- Check the demo note is visible on every page the ticket touched.
- One phone-width check (`resize_window` mobile) per new screen, then reset to desktop.

## Step 3: Fix or flag
- A failed criterion caused by a bug: fix it (follow the `lean` skill), then recheck only that criterion. At most two attempts, then flag it.
- A failure that needs a product decision: don't guess; flag it.

## Step 4: Report
- Tick the criteria that passed in the ticket.
- Reply with a table: criterion | pass / fail / flagged | what I saw. Attach one screenshot per new screen.
- Give Marina the localhost link and the 2–3 pages to try by hand. Leave the server running.
- Stop. Pushing waits for Marina's "push".
