// ── MAIN ──────────────────────────────────────────────────────────────────
// Entry point — wires up layout and imports all modules.

import { layout } from './paper.js';
import { state }  from './state.js';

import './pdf.js';

// keyboard.js and archive.js self-register their event listeners on import
import './keyboard.js';
import './archive.js';

window.addEventListener('load', layout);
window.addEventListener('resize', () => { if (!state.isHeld) layout(); });