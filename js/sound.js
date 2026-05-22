// ── SOUND ─────────────────────────────────────────────────────────────────
// Generates retro typewriter click sounds using the Web Audio API.
// No external files needed — all synthesized.

const ctx = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data       = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 12);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // tone layer — gives it the metallic clack
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type      = 'square';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);

  // noise layer — the paper/hammer thud
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.28, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
  source.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  source.start();
}

function playReturn() {
  // carriage return — longer metallic slide
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

function playDing() {
  // end of line ding — bright bell
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

function playBackspace() {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

// AudioContext needs a user gesture to start — resume on first interaction
document.addEventListener('keydown', () => ctx.resume(), { once: true });

export { playClick, playReturn, playDing, playBackspace };

let muted = false;

const muteBtn = document.getElementById('mute-btn');

muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '♪ muted' : '♪ sound';
  muteBtn.classList.toggle('muted', muted);
});

export function isMuted() { return muted; }