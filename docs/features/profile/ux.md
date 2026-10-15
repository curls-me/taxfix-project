# TFX-05 Profile — UX brief (quick)

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
- **Profile empty:** fields empty with example placeholders ("Max Mustermann", "Musterstr. 1", "10115", "Berlin", "12/345/67890"), no errors until Save is pressed.
- **Validation error:** red message under each failing field; focus moves to the first one.
- **Success:** back on the previous page; suggestion: a short "Profile saved" note there (copy TBD).

## Connections
**In (links to Profile):**
- Account page → Profile (no `from`; Save/Cancel return to Account).
- Dashboard to-do card → Profile `?from=/` (TFX-04).
- Dashboard arrow CTA → Profile `?from=/` (TFX-04).
- VAT return banner → Profile `?from=/filing/2026-10` (TFX-06).
- Main nav "Account" → Account page.

**Out (from Profile):** Save → `from` page or Account. Cancel → same, without saving. Main nav stays available.

**Flags:**
- Not a dead end: Profile always has Save, Cancel and the nav.
- After saving from the Dashboard, the to-do and CTA should disappear (TFX-04 must hide both when complete, or the CTA becomes a stale link).
- VAT return banner should use the real current period path, not a hard-coded `2026-10`, if TFX-06 supports other periods.
- Income / Expense lists: no link to Profile, and none needed (profile is not required to record transactions).
- Create invoice (TFX-07, future): invoices normally carry the seller's name, address and tax number. If TFX-07 reads them from Profile, it needs its own link to Profile with `?from=` when details are missing; otherwise a tester hits a blank seller block with no way to fix it. Flag for TFX-07's spec.

## Suggestions (not in the ticket)
- Show the German term next to "Tax number" for trust.
- Focus the first error on failed save.

Next step: `/build TFX-05`.
