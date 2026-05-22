// ── SHARED STATE ──────────────────────────────────────────────────────────
// Single source of truth — imported by all other modules.

export const state = {
  text:           '',      // raw text on current page
  lines:          1,       // 1-based line count on current page
  col:            0,       // char position on current line
  pageNum:        1,
  savedPages:     [],      // array of { num, text } for completed pages
  linesPerPage:   20,      // computed in layout()
  slotY:          0,       // screen-Y of slot (for splats)
  isHeld:         false,   // read-mode active?
  holdTimer:      -1,
  newPagePending: false,
};

export const CONSTANTS = {
  LINE_H:  30,   // px — must match CSS line-height
  COLS:    50,   // chars before auto-wrap
  HOLD_MS: 320,  // ms hold to enter read mode
  PAD_TOP: 14,   // paper top padding px
};
