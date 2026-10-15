---
name: problem-definition
description: Turn a short discovery input into a one-page problem definition for one feature. Use "/problem-definition <slug>" for the full mode or "/problem-definition quick <slug>" in the live interview.
---

# Define the problem

Help me define the problem before choosing a solution. Arguments: `$ARGUMENTS` (optional `quick`, then a short feature slug such as `vat-overview`).

## Context
Read only `PRODUCT.md` and `docs/company-context.md`. Do not read other files unless I name them. Use only facts supported by this context or my answers. Never silently decide product questions.

## Discovery
Start from my short description of who the user is and what hurts.

1. Identify important gaps or conflicting assumptions.
2. Prioritise: the user and situation, the job they need to do, the main pain, how success is measured, and scope. Ask only questions that could change the definition.
3. **Full mode:** at most five questions, one theme at a time; wait for my answer before the next.
   **Quick mode:** at most three questions, all in one message, each with your recommended answer so I can reply "ok" or correct it.
4. If I do not know an answer, mark it as unknown. Do not invent facts or force a decision.

## Output
Write `docs/features/<slug>/problem.md`. Plain language, one page (quick mode: half a page), these headings:

- **User:** who experiences the problem and in what situation.
- **Job to be done:** what the user needs to accomplish.
- **Pain points:** the main difficulties and their consequences.
- **Success measure:** an observable way to tell it is better solved. Mark proposals as proposals.
- **Out of scope:** what this work will not address.
- **Open questions:** decisions or facts still unresolved.

Keep the problem separate from solutions; no feature list. Stop after writing the file and name the next step: `/spec <slug>`.
