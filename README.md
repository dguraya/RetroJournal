# RetroJournal

A retro typewriter journaling experience built for the web.
Type, listen, archive — one page at a time.

---

## ✦ Features

- **Rising paper** — paper grows upward from the slot as you type, just like a real typewriter
- **Page archive** — completed pages stack on the right side, tap any to read it
- **Hold to read** — press and hold the current page to float it center screen
- **Typewriter sounds** — every keystroke has a synthesized retro clack, with a bell at end of line
- **Mute toggle** — small sound button bottom left to silence everything
- **Make it a book** — exports all your pages as a beautifully styled PDF with a cover page
- **Custom font** — hand-lettered display font for the title
- **No backend** — runs entirely in the browser, no accounts, no data stored anywhere

---

## ✦ Tech

- Vanilla HTML, CSS, JavaScript
- ES Modules (import/export) — no bundler needed
- Web Audio API — typewriter sounds synthesized in real time, no audio files
- Native browser print API — PDF export

---

## ✦ File Structure

    RetroJournal/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── main.js
    │   ├── state.js
    │   ├── paper.js
    │   ├── archive.js
    │   ├── keyboard.js
    │   ├── sound.js
    │   └── pdf.js
    └── fonts/
        └── Dinosaursarealive-lpMd.ttf

---

## ✦ Running Locally

This project uses ES modules so it must be served over HTTP, not opened as a file directly.

The easiest way is the Live Server extension in VS Code:

1. Install Live Server by Ritwick Dey from the VS Code extensions panel
2. Right-click index.html in the file explorer
3. Click Open with Live Server
4. Opens at http://127.0.0.1:5500

---

## ✦ Live

[dguraya.github.io/RetroJournal](https://dguraya.github.io/RetroJournal)

---

## ✦ How to Use

| Action | What happens |
|---|---|
| Type anything | Paper rises from the slot |
| Fill a page | Page archives to the right automatically |
| Click an archived page | Opens it fullscreen to read |
| Hold the paper | Current page floats up to read |
| End of line | Bell dings, carriage returns |
| sound button | Toggles all sound on/off |
| make it a book | Exports everything as a PDF |

---

## ✦ Credits

Designed and built by **Dhawalpreet**

Font — Dinosaurs Are Alive by its respective author

---

*write like no one is watching.*