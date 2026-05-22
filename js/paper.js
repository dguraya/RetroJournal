// ── PAPER ─────────────────────────────────────────────────────────────────
// Handles paper sizing and layout geometry.

import { state, CONSTANTS } from './state.js';

const paperCol  = document.getElementById('paper-col');
const paper     = document.getElementById('paper');
const readPaper = document.getElementById('read-paper');

export function layout() {
  const slotEl   = document.getElementById('slot');
  const slotRect = slotEl.getBoundingClientRect();
  state.slotY = slotRect.top;

  paperCol.style.top    = '0px';
  paperCol.style.bottom = (window.innerHeight - state.slotY) + 'px';

  const colH = state.slotY;
  state.linesPerPage = Math.max(3, Math.floor((colH - CONSTANTS.PAD_TOP) / CONSTANTS.LINE_H));

  const fh = Math.min(colH * 0.9, window.innerHeight * 0.82);
  const ft = (window.innerHeight - fh) / 2;
  readPaper.style.top    = ft + 'px';
  readPaper.style.height = fh + 'px';

  syncPaperHeight();
}

export function syncPaperHeight() {
  paper.style.height = (CONSTANTS.PAD_TOP + state.lines * CONSTANTS.LINE_H) + 'px';
}