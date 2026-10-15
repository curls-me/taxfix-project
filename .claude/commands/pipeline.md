---
name: pipeline
description: Run several tickets through spec, UX, build and local verification in one go, surfacing only critical decisions ("/pipeline TFX-05 TFX-06 TFX-04"). Ends with one draft PR after Marina says "push".
---

# Pipeline

Arguments: `$ARGUMENTS` (ticket IDs, in build order). With no arguments, take every ticket with `Status: Ready`, in ticket-number order. Only `Ready` tickets run: if a named ticket is `Backlog`, leave it out and say so in one line (Marina promotes a ticket by changing its first line to `Status: Ready`). Runs `/spec quick`, `/ux-design quick`, `/build` and `/verify` for each ticket. Running this command is Marina's approval to start one subagent per ticket in Phase 1.

## Phase 0: Start clean
`git fetch`. If local `main` is behind `origin/main`, fast-forward it. If there are uncommitted changes or a branch that isn't merged, tell Marina before going on.

## Phase 1: Decisions (one stop)
1. One subagent per ticket (Opus), in parallel. Each follows `/spec quick` and `/ux-design quick` but **does not ask Marina**: it returns its open questions, each with a recommendation. It writes only its own ticket and `docs/features/<slug>/` files.
2. Merge all the questions into **one message** to Marina, grouped by ticket. Flag conflicts between tickets (e.g. two tickets defining the same field differently).
3. After she answers, finish the specs and UX briefs and add the `Spec agreed` line to each ticket.

## Phase 2: Build (one agent, in order)
- One builder (Sonnet), tickets in the given order, following `/build` in batch mode: one branch, one commit per ticket.
- Stop for Marina only when something is critical:
  - a product decision the spec didn't settle,
  - a change outside the tickets' scope,
  - a build error it can't fix in two attempts.
  Everything else: decide, note it in the PR description, and continue.

## Phase 3: Verify locally
Run `/verify` with all the tickets. Then Marina tests the localhost link by hand. Nothing is pushed until she says "push".

## Phase 4: Push
Push, open **one draft PR** (one section per ticket: criteria, screenshots, decisions made along the way), and set each ticket to `Status: In review`. Stop. After Marina merges, close out with `/git-closeout`.
