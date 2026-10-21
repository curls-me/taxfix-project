# UX brief: pricing page with a plan advisor (TFX-11)

Scope is as agreed in the ticket. Items marked *(suggestion)* are mine and can be changed without changing the ticket.

## Key screens

One page, `/pricing`, designed for a phone first. Top to bottom:

1. **Header and demo note.** Title and one line on what the page is for. Demo note: "Demo: plans, prices and figures are illustrative."
2. **Advisor entry.** One button, "Not sure which plan? Answer 3 quick questions." It sits above the plans so a phone user sees it first. The page works without it. Main action: start.
3. **Plan cards.** Three stacked cards on mobile, side by side on desktop: name, price, one line on who does the work, and what you get (the case-pack list). Main action per card: "Choose this plan".
   *(suggestion)* A small "How the plans differ" strip under the cards puts Check and Expert side by side in one sentence each, since users say they sound the same:
   - Check: "You do the return, an expert reviews it before it is sent."
   - Expert: "An expert does and sends the return for you, from your documents."
4. **Advisor panel** (opens in place, no new page). One question per step with a progress marker ("Question 2 of 3"), a Back option, then a result: the recommended plan, reasons, and "Choose this plan". Below it: "Pick a different plan" and "Start over".
5. **Demo end note** after choosing a plan: "Demo: checkout isn't built. Nothing was submitted or paid."

## Main user flow

1. Visitor lands, sees the plans and the advisor button.
2. Either picks a plan straight from the cards, or opens the advisor.
3. Advisor asks up to three closed questions, one at a time, each with two fixed answers and a one-line "what this means" under every option. No open or self-rating questions (no "how confident are you"). The questions are built around the line users confuse, Self-service vs Check, with Expert separated first because Check refunds come from people who wanted that. *(suggestion)*
   - **Q1. Who fills in your return?** "I'll fill it in myself, in the app" / "I'd rather hand it over: an expert does and sends it for me." Handing over always gives Expert, but Q2 and Q3 are still asked (always exactly 3 questions, per Marina) and only shape the reasons.
   - **Q2. Before it is sent, what do you want?** Two first-person statements:
     - "The app's automatic checks are enough for me." (Self-service: the app flags missing or inconsistent entries; no person reads your return.)
     - "I want an expert to read my finished return before it goes to the tax office." (Check: you still do all the work; an expert reviews it before it is submitted.)
   - **Q3. If you get stuck, how do you want help?** "By email" / "In a chat with someone". Always shown: it explains that email support comes with Self-service and chat support comes with Check.
4. Result: one recommended plan with two or three plain reasons that quote the visitor's answers, plus a two-row "Self-service vs Check" or "Check vs Expert" comparison of the recommended plan and its nearest neighbour. Decision point: accept, pick a different plan, or start over.
5. Choosing a plan shows the demo end note.

*(suggestion)* Recommendation rule for the build:
- Q1 "hand over" gives Expert.
- Q1 "myself" plus Q2 "checks are enough" gives Self-service.
- Q1 "myself" plus Q2 "expert reads it" gives Check.
- Q3 never changes the plan. It only adds a reason. If someone wants chat but "checks are enough", the result says chat support comes only with Check and still shows Self-service as the alternative.

## UI principles

- **Clarity.** Labels name the thing ("Self-service + Check"), not marketing words. Reasons quote the visitor's answers ("You said you want an expert to do it"). No tax vocabulary.
- **Resilience.** Going Back keeps earlier answers. Start over clears them, and only on request. If the visitor changes an answer, the recommendation updates. Picking a plan different from the recommendation is allowed with no warning or pressure.
- **Access.** Options are real radio buttons or buttons, usable by keyboard with a visible focus. Moving to the next question moves focus to its heading. Text is readable at 375px with no horizontal scroll. Contrast meets normal reading standards. Colour is never the only signal of the recommended plan.

## States to design

- **Advisor, question:** nothing selected → "Next" disabled; with a hint "Pick one to continue". There is no free text, so no validation errors.
- **Advisor, result (success):** recommended plan card, reasons, "Choose this plan", "Pick a different plan", "Start over". The recommended card on the page gets a "Recommended for you" tag.
- **Advisor, still unsure:** every question has a "What's the difference?" link that opens the side-by-side Self-service vs Check explanation without losing answers.
- **Plan chosen (success):** demo end note, with "Back to plans".
- **Page, error/empty:** none needed (static content, no backend). If the advisor script fails, the plan cards still work on their own.

## Flagged for Marina

- Ticket criterion updated to "exactly 3 closed questions" (Marina's decision).
- The questions and the recommendation rule are suggestions; the ticket only requires that all three plans can be recommended and that reasons are shown.
- "Email support" and "chat support" come from the case pack plan descriptions; no response times are claimed.
