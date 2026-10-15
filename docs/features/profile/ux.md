# TFX-05 Profile — UX brief (quick, draft)

Draft: ticket has no "Spec agreed" line yet; open questions are listed in the ticket.

## Key screens
- **Account** (`/account`): one card, "Profile", with a status badge (Complete / Missing details). Main action: open Profile.
- **Profile** (`/account/profile`): short form — full name, tax number, street and number, postcode, city; read-only "Filing period: Monthly". Main action: Save. Secondary: Cancel.

## Main flow
1. Tester sees "Complete your profile" on the Dashboard to-do or the VAT return banner.
2. Opens Profile; the page says why these details are needed.
3. Fills the fields (fictional placeholders show the format).
4. Save → if valid, returns to where they came from, where the to-do or banner is now gone. If not, inline errors; nothing is cleared.

## UI principles here
- **Clarity:** one-line reason at the top; labels in plain words ("Tax number", not "Steuernummer" alone; German term can follow in grey). Errors say what to type.
- **Resilience:** typed values survive a failed save; reopening pre-fills from storage; saving twice is harmless.
- **Access:** real labels on every input, Enter submits, visible focus, single column that works at phone width.

## States
- **Account:** Missing details (amber badge) / Complete (green badge).
- **Profile empty:** placeholders only, no errors until Save is pressed.
- **Validation error:** red message under each failing field; focus moves to the first one.
- **Success:** back on the previous page; suggestion: a short "Profile saved" note there (copy TBD).

## Suggestions (not in the ticket)
- Show the German term next to "Tax number" for trust.
- Focus the first error on failed save.

Next step: `/build TFX-05` once the spec is agreed.
