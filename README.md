# Personal site & resume

**Joe Burns** — Trust & Safety · Safeguards · Abuse Infrastructure Disruption

Public source for my personal landing page: professional summary, links, and (as the site grows) project highlights. Built as a fast, static-friendly React app so it stays easy to deploy and iterate.

## Stack

- **Vite** — dev server and production build
- **React 19** + **TypeScript**
- **Motion**, **GSAP**, **OGL** — motion and lightweight WebGL where used in the UI

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

### Deploying under a subpath

If the site is hosted under a path (for example GitHub Pages as `username.github.io/repo-name/`), set a base path before building:

```bash
# .env.production (or your host’s env)
VITE_BASE_PATH=/your-repo-name/
```

The default is `/` (site at domain root).

## Third-party code

MIT-licensed **BlurText** and **Grainient** patterns are adapted from [React Bits](https://reactbits.dev/).

## Privacy

This repository contains only front-end code and public content. No API keys or secrets belong here; keep those out of commits and use your host’s environment/secret storage if you add server-side pieces later.
