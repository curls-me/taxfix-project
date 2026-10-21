Status: In progress
# TFX-11 — Pricing page with a plan advisor
Feature: docs/features/ai-plan-advisor/

## Scope
A mobile-first pricing page (`/pricing`, separate from the VAT app) for the self-employed annual return. It shows the three plans so the differences are clear on a phone, and a short guided assistant that asks a few questions and recommends one plan with reasons. Plans, prices and figures are illustrative; a visible "demo" note says so.

Plans (from the case pack): Self-service €39, Self-service + Check €79, Expert service €199.

## Decisions
- **Plan comparison plus assistant, not assistant only.** Mobile converts at 9.2% vs 13.7% on desktop and the comparison is hidden behind a link; the comparison fixes that directly, the assistant covers "which plan do I need".
- **Scripted assistant, no live AI.** Fast, free, predictable, no key or backend (repo rule). It is a demo of the idea, not real AI.
- **Check stays in the recommendations**, explained plainly against Expert, so we can learn whether it works when understood. Dropping it is not decided here.
- **Recommend by fit, not price.** The assistant may recommend the cheapest plan that fits and always shows its reasons; no upselling.
- **Recommendation is editable.** The user can pick any plan, or restart the questions.
- **No analytics.** KPIs (visit → paid, Check refund rate, "which plan" tickets) are what a live test would track, not built here.
- **One PR.** Checkout, real AI, analytics and A/B testing are follow-ups.

## Acceptance criteria
- [x] `/pricing` is reachable and shows all three plans with price and what you get, with no "Compare plans" link needed on a 375px-wide screen.
- [x] Each plan states in one plain line who does the work (you / you + an expert reviews / an expert does it).
- [x] The assistant asks exactly 3 closed questions (two fixed answers each), one at a time, and ends with one recommended plan and the reasons in plain language.
- [x] The recommendation can be overridden (user picks another plan) and the questions can be restarted.
- [x] Different answers lead to different recommendations (all three plans can be recommended).
- [x] Self-service + Check is explained against Expert service on the page and in the recommendation.
- [x] Choosing a plan shows a "demo, checkout not built" note and nothing is submitted or paid.
- [x] A visible demo note states plans, prices and figures are illustrative.
- [x] Works on desktop and mobile widths; assistant usable by keyboard.
- [x] No real personal data; no secrets; `npm run build` passes.

## Out of scope
- Real AI or any API call; checkout; analytics; A/B testing.
- Changing prices or plan contents; dropping Check.
- The Fixi in-app advisor (TFX-09).
- Linking the page from the VAT app.

## Copy
[copy TBD] Exact UI text is set in `/ux-design`. Fixed text: plan names and prices above; demo note "Demo: plans, prices and figures are illustrative."; plan one-liners per the "who does the work" criterion.

Spec agreed 2026-10-21.
