# Font Compare

Compare fonts installed on your computer, Google Fonts, and Morisawa fonts side by side — all at once, with the same text.

[日本語版はこちら](README.ja.md)

## Features

- **Local font detection** — reads fonts installed on your machine via the [`queryLocalFonts()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/queryLocalFonts) API (Chrome / Edge)
- **Google Fonts** — ~140 curated popular families, loaded on demand
- **Morisawa detection** — flags locally installed fonts that match known Morisawa naming patterns (name-based heuristic, not an official API)
- **Japanese / English tabs** — auto-classified by name and, as a fallback, by rendering glyphs to a canvas and measuring their shape (serif detection, monospace detection, Gothic vs. Mincho stroke-width analysis)
- **Category filters** — Sans/Mono, Serif, Script/Display, Other (English); Gothic, Mincho, Rounded, Other (Japanese)
- **Grid overview** — up to 13 columns, so you can scan hundreds of fonts at once
- **Side by side** — click a font card to pin it to a comparison row; click its name to copy the family name
- **Overlay** — Shift+click to stack fonts on top of each other with adjustable opacity, for direct shape comparison
- **Shared typography controls** — font size, line height, letter spacing, and weight apply to every font at once
- **Light / dark background** toggle

## Getting started

```bash
npm install
npm run dev
```

Open the app in Chrome or Edge and click **Load local fonts** to grant font access (a browser permission prompt will appear). Without this, only Google Fonts are shown.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS v4

## Notes on Morisawa detection

There is no public API for Morisawa fonts. Detection relies on matching font family names against known Morisawa naming conventions (e.g. `A-OTF`, `G-OTF`, `U-OTF` prefixes, book names like Ryumin, ShinGo, A1 Mincho). This only works for fonts already installed locally (e.g. via MORISAWA PASSPORT) — it cannot preview fonts you haven't downloaded.
