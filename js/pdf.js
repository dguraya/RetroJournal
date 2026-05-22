// ── PDF EXPORT ─────────────────────────────────────────────────────────────
// Collects all pages and prints them as a styled PDF book.

import { state } from './state.js';

const btn = document.getElementById('save-pdf-btn');

btn.addEventListener('click', exportPDF);

function exportPDF() {
  // Gather all pages — completed ones + current page
  const allPages = [
    ...state.savedPages.map(p => ({ num: p.num, text: p.text })),
    { num: state.pageNum, text: state.text }
  ].filter(p => p.text.trim().length > 0);

  if (allPages.length === 0) {
    btn.textContent = 'nothing yet →';
    setTimeout(() => btn.textContent = 'make it a book →', 1800);
    return;
  }

  // Build a hidden print window
  const win = window.open('', '_blank');

  const pagesHTML = allPages.map(p => `
    <div class="page">
      <div class="page-num">— ${p.num} —</div>
      <div class="page-text">${escapeHTML(p.text)}</div>
    </div>
  `).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>retro journal</title>
      <link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet"/>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
          background: #f5f0e8;
          font-family: 'Special Elite', 'Courier New', monospace;
        }

        .cover {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          page-break-after: always;
          background: #f5f0e8;
        }

        .cover-title {
          font-size: 42px;
          letter-spacing: 0.3em;
          color: #1a0d04;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .cover-sub {
          font-size: 13px;
          letter-spacing: 0.25em;
          color: rgba(0,0,0,0.35);
          text-transform: uppercase;
        }

        .cover-line {
          width: 120px;
          height: 1px;
          background: rgba(0,0,0,0.2);
          margin: 22px 0;
        }

        .cover-date {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(0,0,0,0.25);
          text-transform: uppercase;
        }

        .page {
          width: 100vw;
          min-height: 100vh;
          padding: 72px 96px;
          page-break-after: always;
          background: #f5f0e8;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .page-num {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: rgba(0,0,0,0.25);
          text-align: center;
          margin-bottom: 48px;
          text-transform: uppercase;
        }

        .page-text {
          font-size: 15px;
          line-height: 34px;
          color: #1a0d04;
          letter-spacing: 0.05em;
          white-space: pre-wrap;
          word-break: break-word;
          flex: 1;
        }

        .footer {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(0,0,0,0.18);
          text-align: center;
          margin-top: 48px;
          text-transform: uppercase;
        }

        @media print {
          body { background: #f5f0e8; }
          .cover, .page { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <div class="cover-title">retro journal</div>
        <div class="cover-line"></div>
        <div class="cover-sub">${allPages.length} ${allPages.length === 1 ? 'page' : 'pages'}</div>
        <div class="cover-line"></div>
        <div class="cover-date">${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
      </div>

      ${pagesHTML}

    </body>
    </html>
  `);

  win.document.close();

  // Wait for font to load then print
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  };

  btn.textContent = 'saving... ✦';
  setTimeout(() => btn.textContent = 'make it a book →', 2000);
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}