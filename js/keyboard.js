// ── KEYBOARD + READ MODE ───────────────────────────────────────────────────

import { state, CONSTANTS } from './state.js';
import { syncPaperHeight, layout } from './paper.js';
import { archivePage } from './archive.js';

// ── DOM refs ──────────────────────────────────────────────────────────────
const typedEl      = document.getElementById('typed-content');
const machine      = document.getElementById('machine');
const hint         = document.getElementById('hint');
const dingEl       = document.getElementById('ding');
const holdHint     = document.getElementById('hold-hint');
const pageBadge    = document.getElementById('page-badge');
const flashEl      = document.getElementById('flash');
const readOverlay  = document.getElementById('read-overlay');
const readPaperEl  = document.getElementById('read-paper');
const readContent  = document.getElementById('read-content');
const readLabel    = document.getElementById('read-page-label');
const readCloseBtn = document.getElementById('read-close-btn');
const paper        = document.getElementById('paper');
const sPage        = document.getElementById('s-page');
const sLine        = document.getElementById('s-line');
const sWords       = document.getElementById('s-words');

// ── READ MODE ─────────────────────────────────────────────────────────────
// Called from archive.js (tap on archived page) or hold on current paper.
export function openRead(pageText, num) {
  if (state.isHeld) return;
  state.isHeld = true;
  readContent.textContent = pageText;
  if (readLabel) readLabel.textContent = `page ${num}`;
  readOverlay.classList.add('on');
  readPaperEl.classList.add('on');
  machine.classList.add('retracted');
}

function closeRead() {
  if (!state.isHeld) return;
  state.isHeld = false;
  readOverlay.classList.remove('on');
  readPaperEl.classList.remove('on');
  machine.classList.remove('retracted');
  readPaperEl.scrollTop = 0;
}

// ── HOLD ON CURRENT PAPER ─────────────────────────────────────────────────
function startHold() {
  const allText = state.savedPages.map(p => p.text).join('') + state.text;
  if (!allText.length) return;
  clearTimeout(state.holdTimer);
  state.holdTimer = setTimeout(() => openRead(state.text, state.pageNum), CONSTANTS.HOLD_MS);
}
function cancelHold() { clearTimeout(state.holdTimer); }

paper.addEventListener('mousedown',  startHold);
paper.addEventListener('touchstart', () => startHold(), { passive: true });
document.addEventListener('mouseup',  cancelHold);
document.addEventListener('touchend', cancelHold);
readOverlay.addEventListener('click', closeRead);
readCloseBtn.addEventListener('click', closeRead);

// ── NEW PAGE ──────────────────────────────────────────────────────────────
function doNewPage() {
  state.newPagePending = false;

  state.savedPages.push({ num: state.pageNum, text: state.text });
  archivePage(state.text, state.pageNum);

  flashEl.classList.add('on');
  setTimeout(() => flashEl.classList.remove('on'), 150);

  state.pageNum++;
  state.text  = '';
  state.lines = 1;
  state.col   = 0;

  typedEl.querySelectorAll('.char').forEach(s => s.remove());

  pageBadge.textContent   = `page ${state.pageNum}`;
  pageBadge.style.opacity = '1';
  clearTimeout(pageBadge._t);
  pageBadge._t = setTimeout(() => { pageBadge.style.opacity = '0'; }, 1800);

  syncPaperHeight();
  updateStats();
}

// ── ADD CHAR ──────────────────────────────────────────────────────────────
function addChar(ch, isNewline) {
  const span       = document.createElement('span');
  span.className   = 'char';
  span.textContent = isNewline ? '\n' : ch;
  typedEl.appendChild(span);

  if (isNewline) {
    state.col = 0;
    state.lines++;
  } else {
    state.col++;
    if (state.col >= CONSTANTS.COLS) {
      state.col = 0;
      state.lines++;
      triggerDing();
    }
  }

  syncPaperHeight();

  if (state.lines > state.linesPerPage && !state.newPagePending) {
    state.newPagePending = true;
    setTimeout(doNewPage, 80);
  }
}

// ── BACKSPACE ─────────────────────────────────────────────────────────────
function doBackspace() {
  if (!state.text.length) return;

  const last  = state.text[state.text.length - 1];
  state.text  = state.text.slice(0, -1);

  const lastSpan = typedEl.querySelector('.char:last-of-type');
  if (lastSpan) lastSpan.remove();

  if (last === '\n') {
    state.lines = Math.max(1, state.lines - 1);
    state.col   = 0;
    for (let i = state.text.length - 1; i >= 0; i--) {
      if (state.text[i] === '\n') break;
      state.col++;
    }
    state.col = state.col % CONSTANTS.COLS;
  } else {
    if (state.col > 0) {
      state.col--;
    } else if (state.lines > 1) {
      state.lines--;
      state.col = CONSTANTS.COLS - 1;
    }
  }

  syncPaperHeight();
}

// ── DING ──────────────────────────────────────────────────────────────────
function triggerDing() {
  dingEl.classList.add('on');
  clearTimeout(dingEl._t);
  dingEl._t = setTimeout(() => dingEl.classList.remove('on'), 950);
}

// ── SPLAT ─────────────────────────────────────────────────────────────────
function splat() {
  const cx = window.innerWidth / 2;
  const cy = state.slotY + 2;
  for (let i = 0; i < 2; i++) {
    const s  = document.createElement('div');
    s.className = 'splat';
    const sz = 2.5 + Math.random() * 3;
    s.style.cssText =
      `width:${sz}px;height:${sz}px;` +
      `left:${cx + (Math.random() - 0.5) * 26}px;` +
      `top:${cy  + (Math.random() - 0.5) * 5}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 360);
  }
}

// ── KEY VISUAL ────────────────────────────────────────────────────────────
function pressKey(label) {
  for (const k of document.querySelectorAll('.k')) {
    if (k.textContent.trim().toLowerCase() === label.toLowerCase()) {
      k.classList.add('pressed');
      setTimeout(() => k.classList.remove('pressed'), 110);
      break;
    }
  }
}

// ── STATS ─────────────────────────────────────────────────────────────────
function updateStats() {
  const allText = state.savedPages.map(p => p.text).join('') + state.text;
  const wc = allText.trim() ? allText.trim().split(/\s+/).length : 0;
  sPage.textContent  = `page ${state.pageNum}`;
  sLine.textContent  = `line ${state.lines}`;
  sWords.textContent = `${wc} words`;
  holdHint.classList.toggle('on', allText.length > 0);
}

// ── KEYBOARD ──────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Escape') { closeRead(); return; }
  if (state.isHeld || state.newPagePending) { if (state.isHeld) closeRead(); return; }

  e.preventDefault();
  hint.style.opacity = '0';
  splat();

  if (e.key === 'Backspace') {
    doBackspace();
    pressKey('del');
    updateStats();
    return;
  }

  let ch = null, isNL = false;
  if (e.key === 'Enter')        { ch = '\n'; isNL = true; pressKey('return'); }
  else if (e.key === ' ')       { ch = ' '; }
  else if (e.key.length === 1)  { ch = e.key; pressKey(e.key); }
  else return;

  state.text += ch;
  addChar(ch, isNL);
  updateStats();
});