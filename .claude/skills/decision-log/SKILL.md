---
name: decision-log
description: Append a session summary + decision log to the local decision log file. Trigger at the end of a working session, or when the user says "log this session", "decision log", "post the summary", or "/decision-log". Produces a short summary and attributes every decision to the user or Claude.
---

# Decision log

Append an entry for the current session (newest entry at the top) to
**`local docs/decision-log.md`** in the project root (the folder that holds
`docs/` and `.claude/`). If the session runs in a git worktree, use the main
repo folder's copy: `dirname "$(git rev-parse --path-format=absolute --git-common-dir)"`.
If the file does not exist, create it with a `# Decision log` header, a one-line
preamble, and a `---` rule, then add the entry below it.

**The log stays local. Never commit it, never offer to.** `local docs/` must be
in `.gitignore` once this project is a git repo — it records who decided what
between Marina and Claude, which is hers and not the repo's. When the repo
exists, check `.gitignore` has `local docs/` and add it if missing.

**Do not read the whole file.** It grows every session. Scan structure, then
read only the top entry (see "How to post").

## Why this exists

A durable record of (a) what happened in each working session across the
discovery → spec → build → ship pipeline and (b) who made each decision, so
accountability between the PM and the AI stays clear and the interview story
("what did you decide vs. what did the AI propose") is easy to tell.

## What to write

One entry per session, with this exact structure:

```
# YYYY-MM-DD — <short session title>

## Summary
<ONE short paragraph, ~100 words or less. Plain language, lead with the
outcome. Link every artifact touched or referenced — Linear issues (MAR-nn),
GitHub PRs, docs, files — as inline markdown links. End with the agreed next
step.>

## Decided by the user
<bullets — decisions they made or explicitly chose between options>

## Suggested by Claude, approved by the user
<bullets — recommendations Claude made that they accepted as-is>

## Suggested by Claude, not approved / amended by the user
<bullets — recommendations they rejected or corrected, each stating what
changed. If none, write "None this session." — never omit the section,
its emptiness is information.>
```

## Rules

- **Attribution honesty is the point.** When unsure who decided something, put
  it under "Suggested by Claude, approved" — never inflate the user's list with
  Claude's ideas, and never bury their corrections.
- A decision the user *amended* goes in the third list with the amendment.
- One line per bullet; bold the decision, keep the reason short.
- The summary must stand alone — someone who wasn't in the session should
  understand it without opening anything.
- Record `/spec` outcomes here: each product decision agreed in a spec review
  is a "Decided by the user" bullet naming the ticket.

## How to post

1. **Scan structure, don't read:** `grep -n '^# \|^### Session' "local docs/decision-log.md" | head -6`
   Read only the range of the current top entry (`sed -n 'A,Bp'`).
2. **Same-day rollup:** if the top entry is already headed with *today's* date,
   insert a `### Session N — <title>` block (N starts at 2) directly under that
   heading, with its own Summary/Decided/Suggested sections. Otherwise create a
   new `# YYYY-MM-DD` entry between the preamble's `---` and the previous top
   entry, followed by its own `---`.
3. Never edit or delete earlier entries. To correct one, add a dated correction
   line in the new entry.
4. After writing, paste the Summary into the chat reply.
