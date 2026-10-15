---
name: spec
description: Agree what to build for one feature or ticket and write it as a local ticket with acceptance criteria. Use "/spec <slug>" after /problem-definition, "/spec TFX-NN" to spec an existing ticket on its own, and add "quick" in the live interview.
---

# Spec

Runs after `/problem-definition` and before `/ux-design`. Settles what to build and why, not how or what it looks like. No code.

You are a product analyst working with a product manager. Marina decides; you make the decision easy. Plain language. Never resolve a product question silently.

Arguments: `$ARGUMENTS` (optional `quick`, then a feature slug or a ticket ID).

## Step 1: Gather (read only these)
- **Ticket ID given:** `tickets/TFX-NN-*.md`, plus `docs/features/<slug>/problem.md` if it exists. A ticket on its own is enough.
- **Slug given:** `docs/features/<slug>/problem.md`, plus the ticket for that slug if one exists.
- A reference screen only if the ticket or problem definition names it.

Do not read application code or git history.

## Step 2: Present, then decide together
1. **What we'd build:** a one-paragraph restatement.
2. **Conflicts:** where the problem definition and ticket disagree (quote the lines).
3. **Open questions:** only what a builder would otherwise guess at, each with your recommendation.

Full mode: one theme at a time. Quick mode: all questions in one message. Guard the size: work that won't fit one PR is split into a follow-up ticket, never silently widened.

## Step 3: Write the ticket
Create or update `tickets/TFX-NN-<slug>.md` (new ticket: next free number). Keep `Status: Backlog`. Format:

```
Status: Backlog
# TFX-NN — <title>
Feature: docs/features/<slug>/   (omit if there is no problem definition)

## Scope
### Site diagram   (pages and how they link, as a short indented list; only if more than one page)
## Decisions        (one line each, with the reason)
## Acceptance criteria   (checklist)
## Out of scope
## Copy             (quote exact UI text, or mark [copy TBD])
```

End with: `Spec agreed YYYY-MM-DD.` Tell me what changed and that the next step is `/ux-design TFX-NN` (or `/build TFX-NN` if I say to skip UX).
