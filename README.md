# Personal site & resume

**Joe Burns** — Trust & Safety · Safeguards · Abuse Infrastructure Disruption

Public source for [replicantsecurity.com](https://replicantsecurity.com): a single-page resume and portfolio built as a static React app (hero, about, skills, experience, education, and social links). Easy to deploy on GitHub Pages or any static host.

## Stack

- **Vite** — dev server and production build
- **React 19** + **TypeScript**
- **Motion**, **GSAP**, **OGL** — text motion, scroll reveals, and WebGL gradient background
- **Canvas** — animated graph backdrop layered over the gradient

## Run locally

```bash
npm install
cp .env.example .env.local   # optional overrides
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Configuration

Copy [`.env.example`](.env.example) to `.env.local` (gitignored) for local overrides:

| Variable | Purpose |
|----------|---------|
| `VITE_BASE_PATH` | Asset base path (`/` at domain root; use `/repo-name/` for GitHub Pages project sites) |
| `VITE_DISCORD_USER_ID` | 17–20 digit Discord user ID for profile links (see comments in `.env.example`) |
| `VITE_API_BASE_URL` | Optional API origin; when set, theme config is fetched from `/site-config` instead of static JSON |

Runtime flags live in [`public/site-config.json`](public/site-config.json):

```json
{ "darkModeAllowed": true }
```

Set `darkModeAllowed` to `false` to lock the site to light mode and hide the theme toggle.

## Build

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

## Deploy

Pushes to `main` run [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) (GitHub Pages). Configure repository **Variables** for production:

- `VITE_BASE_PATH` — required for project Pages (`/repo-name/`); omit or set `/` for a custom domain at root
- `VITE_DISCORD_USER_ID` — optional; falls back to the ID in source if unset
- `VITE_API_BASE_URL` — optional remote config API

Custom domain: [`CNAME`](CNAME) points at `replicantsecurity.com`. For other hosts, set `VITE_BASE_PATH` to match where the built `dist/` is served.

## Third-party code

MIT-licensed **BlurText**, **DecryptedText**, and **Grainient** patterns are adapted from [React Bits](https://reactbits.dev/). **GraphBackdrop** is original to this repo.

## Privacy

This repository contains only front-end code and public resume content. No API keys or secrets belong here; keep those in `.env.local` or your host’s secret/variable storage.
