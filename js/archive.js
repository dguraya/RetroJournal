import { state } from './state.js';
import { openRead } from './keyboard.js';

const archiveArea = document.getElementById('archive-area');

export function archivePage(pageText, num) {
  const pg = document.createElement('div');
  pg.className = 'arc-page';
  const rot = (num % 2 === 0) ? 1.4 : -1.1;

  pg.dataset.text = pageText;
  pg.dataset.num  = num;

  pg.style.transform  = `rotate(${rot + 4}deg) translateY(20px)`;
  pg.style.opacity    = '0';
  pg.style.boxShadow  = `${rot > 0 ? '2px' : '-2px'} 3px 10px rgba(0,0,0,0.22)`;
  pg.style.flexShrink = '0';
  pg.style.position   = 'relative'; // override the absolute from CSS

  pg.appendChild(document.createTextNode(pageText));

  const numEl = document.createElement('div');
  numEl.className   = 'arc-num';
  numEl.textContent = `p.${num}`;
  pg.appendChild(numEl);

  pg.addEventListener('click', () => openRead(pageText, num));

  // prepend so newest is at bottom (flex-direction: column-reverse)
  archiveArea.prepend(pg);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    pg.style.transition = 'transform 0.5s cubic-bezier(0.22,0.61,0.36,1), opacity 0.5s';
    pg.style.transform  = `rotate(${rot}deg)`;
    pg.style.opacity    = '1';
  }));
}