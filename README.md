# Lens Journal

A free, offline-first photography session journal. Log your shots with full EXIF data, tag scenes, track your sweet-spot settings over time, and export your data anytime.

**Live app:** [lens-journal.freeappstore.online](https://lens-journal.freeappstore.online)

## Features

- **Shot logging** — record aperture, shutter speed, ISO, focal length, and lens per shot
- **Scene tags** — portrait, landscape, street, macro, night, wildlife, architecture, travel, sports, abstract
- **Learning notes** — attach a per-session note ("next time try f/8", "increase ISO at dusk")
- **Stats** — see your most-used settings, sweet-spot aperture/shutter/ISO, top lenses, and tag distribution
- **Export / Import** — download your full journal as JSON; import it back on any device
- **Offline-first** — all data stored in `localStorage`; works with no network after first load
- **PWA** — installable on iOS and Android from the browser

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build → web/dist/
```

## Tech

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (utility classes)
- [`@freeappstore/sdk`](https://freeappstore.online) — auth, theme, UI components
- `vite-plugin-pwa` + Workbox — service worker, offline precache

## License

MIT — free to use, fork, and self-host.  
Part of [FreeAppStore](https://freeappstore.online) — no ads, no tracking.
