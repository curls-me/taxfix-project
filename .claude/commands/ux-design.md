---
name: ux-design
description: Turn a spec'd ticket into a short UX brief (screens, flow, principles, states). Use "/ux-design TFX-NN", or "/ux-design quick TFX-NN" in the live interview.
---

# Define the UX design

Produce a design brief, not code. Runs after `/spec` and before `/build`. Arguments: `$ARGUMENTS` (optional `quick`, then the ticket ID).

## Context
Read only `PRODUCT.md`, the ticket `tickets/TFX-NN-*.md`, and the feature's `problem.md` if the ticket links one. Open a reference screen in `docs/reference-screens/` only if the ticket or I name it. Do not invent tax rules, legal requirements, product capabilities or decisions.

If the ticket has no `Spec agreed` line, say so and stop: run `/spec` first. If a decision that materially affects the design is still open, ask me (full mode: one question at a time; quick mode: all in one message, each with your recommendation).

## Output
Write `docs/features/<slug>/ux.md` (slug from the ticket file name). Plain language, under one page (quick mode: half a page):

- **Key screens:** each screen's purpose, essential information and main action.
- **Main user flow:** ordered steps from start to done, with meaningful decision points.
- **UI principles:** how these apply here:
  - Clarity — clear labels, helpful instructions, errors that explain recovery.
  - Resilience — missing data, long content, repeated actions; never lose what the user entered.
  - Access — keyboard use, readable contrast, narrow screens.
- **States to design:** for each relevant screen, empty, error and success states, including validation errors and what the user can do next. (No loading states: there is no backend.)

## Design rules
Task-focused: one clear next step per screen, important information easy to find, consistent words. Tax work demands accuracy and trust. Separate the ticket's agreed requirements from your suggestions; flag anything that would change the ticket instead of changing it.

Save the brief only; no code, no other files. Name the next step: `/build TFX-NN`.
