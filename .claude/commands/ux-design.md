---
name: ux-design
description: Turn an agreed problem definition into a short UX brief (screens, flow, principles, states) for one feature. Use "/ux-design <slug>" or "/ux-design quick <slug>" in the live interview.
---

# Define the UX design

Produce a design brief, not code. Arguments: `$ARGUMENTS` (optional `quick`, then the feature slug).

## Context
Read only `PRODUCT.md` and `docs/features/<slug>/problem.md`. Open a reference screen in `docs/reference-screens/` only if I name it. Do not invent tax rules, legal requirements, product capabilities or decisions.

If the problem definition is missing, say so and stop. If it leaves open a decision that materially affects the design, ask me (full mode: one question at a time; quick mode: all in one message, each with your recommendation).

## Output
Write `docs/features/<slug>/ux.md`. Plain language, under one page (quick mode: half a page):

- **Key screens:** each screen's purpose, essential information and main action.
- **Main user flow:** ordered steps from start to done, with meaningful decision points.
- **UI principles:** how these apply here:
  - Clarity — clear labels, helpful instructions, errors that explain recovery.
  - Resilience — missing data, long content, repeated actions; never lose what the user entered.
  - Access — keyboard use, readable contrast, narrow screens.
- **States to design:** for each relevant screen, empty, error and success states, including validation errors and what the user can do next. (No loading states: there is no backend.)

## Design rules
Task-focused: one clear next step per screen, important information easy to find, consistent words. Tax work demands accuracy and trust. Separate confirmed requirements from suggestions and open decisions; flag anything that depends on an undecided product choice.

Save the brief only; no code, no other files. Name the next step: `/spec <slug>`.
