/**
 * Post-build prerender pass.
 *
 * Serves the built dist/ with vite preview, loads each public route in headless
 * Chromium, waits for the app to render and settle, then snapshots the DOM into
 * static HTML files so crawlers and AI fetchers that do not execute JavaScript
 * receive the full page content.
 *
 * Deliberately excluded:
 *  - /about (dark-launched behind site-config.json; prerendering would bake
 *    hidden copy into public HTML)
 *  - specimen.html (internal type specimen, noindex)
 *
 * The captured /404 route overwrites dist/404.html WITH the app bundle inside,
 * so any non-prerendered path served by GitHub Pages still boots the SPA and
 * client-routes to the right page. Deep links keep working without the old
 * query-string redirect hop.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '..', 'dist')
const SITE_ORIGIN = 'https://joeburns.ai'
const SETTLE_MS = 1500

const ROUTES = [
  {
    path: '/',
    outFile: 'index.html',
    canonical: `${SITE_ORIGIN}/`,
    description:
      'Joe Burns is a Trust & Safety and platform safeguards specialist who builds detection systems for coordinated abuse, reducing detection time from 30 days to under 2 hours. Investigations, detection engineering, and enforcement strategy.',
    /* Hero h1 carries the plain name as aria-label. */
    readySelector: 'h1.hero-name[aria-label="Joe Burns"]',
    ogTitle: 'Joe Burns',
    ogType: 'profile',
  },
  {
    path: '/work/reseller-disruption',
    outFile: 'work/reseller-disruption/index.html',
    aliasFile: 'work/reseller-disruption.html',
    canonical: `${SITE_ORIGIN}/work/reseller-disruption`,
    description:
      'Case study: disruption of third-party automation and reseller ecosystems behind hundreds of thousands of abusive accounts, through behavioral fingerprinting, graph-based clustering, and operator attribution.',
    readyHeading: 'Reseller Ecosystem Disruption',
    ogTitle: 'Reseller Ecosystem Disruption · Joe Burns',
    ogType: 'article',
  },
  {
    path: '/work/abuse-investigation-platform',
    outFile: 'work/abuse-investigation-platform/index.html',
    aliasFile: 'work/abuse-investigation-platform.html',
    canonical: `${SITE_ORIGIN}/work/abuse-investigation-platform`,
    description:
      'Case study: a solo-authored abuse investigation platform running in production, sharing one detector core (rule engine, behavioral scoring, graph-based clustering) across every analyst surface with a human reviewer on every output.',
    readyHeading: 'Abuse Investigation Platform',
    ogTitle: 'Abuse Investigation Platform · Joe Burns',
    ogType: 'article',
  },
  {
    path: '/work/enforcement-app',
    outFile: 'work/enforcement-app/index.html',
    aliasFile: 'work/enforcement-app.html',
    canonical: `${SITE_ORIGIN}/work/enforcement-app`,
    description:
      'Blueprint: a desktop enforcement workflow application with signal ingestion, pattern detection, and verdict routing, with a human decision on every consequential action.',
    readyHeading: 'Enforcement Workflow Application',
    ogTitle: 'Enforcement Workflow Application · Joe Burns',
    ogType: 'article',
  },
  {
    path: '/work/gnn-detection',
    outFile: 'work/gnn-detection/index.html',
    aliasFile: 'work/gnn-detection.html',
    canonical: `${SITE_ORIGIN}/work/gnn-detection`,
    description:
      'Research: benchmarking graph-neural-network detection models against production-shaped abuse topologies to test structure-aware detection against adaptive adversaries.',
    readyHeading: 'Graph-Based Detection Research',
    ogTitle: 'Graph-Based Detection Research · Joe Burns',
    ogType: 'article',
  },
  {
    /* Router '*' route; becomes the GitHub Pages fallback document. */
    path: '/404',
    outFile: '404.html',
    canonical: null,
    description: null,
    readySelector: '.at-page__numeral',
  },
]

/* Dark-launched About copy must never reach prerendered public HTML. */
const FORBIDDEN = ['Off the clock', 'darkroom', 'RESERVED · STYLIZED PORTRAIT']

async function settleHomeAnimations(page) {
  /* Scroll through the page so every once-only ScrollTrigger reveal fires,
     then wait until every section wrapper is fully visible. */
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6))
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(resolve => setTimeout(resolve, 120))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise(resolve => setTimeout(resolve, 400))
    window.scrollTo(0, 0)
  })
  await page.waitForFunction(
    () => {
      const wrappers = Array.from(document.querySelectorAll('.home-section > div'))
      return (
        wrappers.length > 0 &&
        wrappers.every(el => {
          const cs = getComputedStyle(el)
          return cs.visibility === 'visible' && Number(cs.opacity) > 0.99
        })
      )
    },
    { timeout: 20000 }
  )
}

async function capture(page, baseUrl, route) {
  const target = new URL(route.path.replace(/^\//, ''), baseUrl).href
  await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 })

  if (route.readySelector) {
    await page.waitForSelector(route.readySelector, { timeout: 30000 })
  }
  if (route.readyHeading) {
    await page.waitForFunction(
      expected => document.querySelector('h1.at-page__title')?.textContent === expected,
      route.readyHeading,
      { timeout: 30000 }
    )
  }
  if (route.path === '/') {
    await settleHomeAnimations(page)
  }
  await page.waitForTimeout(SETTLE_MS)

  await page.evaluate(({ canonical, description, ogTitle, ogType }) => {
    const setMeta = (attr, key, content) => {
      let meta = document.querySelector(`meta[${attr}="${key}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, key)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
    if (ogTitle) {
      setMeta('property', 'og:title', ogTitle)
      setMeta('name', 'twitter:title', ogTitle)
    }
    if (ogType) setMeta('property', 'og:type', ogType)
    if (canonical) {
      setMeta('property', 'og:url', canonical)
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
  }, { canonical: route.canonical, description: route.description, ogTitle: route.ogTitle, ogType: route.ogType })

  const html = await page.content()
  for (const phrase of FORBIDDEN) {
    if (html.includes(phrase)) {
      throw new Error(`Forbidden (dark-launched) copy "${phrase}" found in prerendered ${route.path}`)
    }
  }
  return html
}

async function main() {
  /* Sanity check: dist must exist (run via npm run build / postbuild). */
  await readFile(path.join(DIST, 'index.html'))

  const server = await preview({ preview: { port: 4173, strictPort: false }, logLevel: 'silent' })
  const baseUrl = server.resolvedUrls.local[0]
  console.log(`[prerender] serving dist at ${baseUrl}`)

  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1440, height: 900 },
    })
    const page = await context.newPage()

    /* Capture everything first, then write, so later captures are never served
       an already-prerendered index.html. */
    const captured = []
    for (const route of ROUTES) {
      console.log(`[prerender] capturing ${route.path}`)
      const html = await capture(page, baseUrl, route)
      captured.push({ route, html })
    }

    for (const { route, html } of captured) {
      /* aliasFile is the extensionless twin (work/<slug>.html) so GitHub Pages
         and sirv answer /work/<slug> directly with a 200 instead of a 301 to
         the trailing-slash directory index. */
      const outFiles = [route.outFile, route.aliasFile].filter(Boolean)
      for (const file of outFiles) {
        const outPath = path.join(DIST, ...file.split('/'))
        await mkdir(path.dirname(outPath), { recursive: true })
        await writeFile(outPath, html, 'utf8')
        console.log(`[prerender] wrote ${path.relative(DIST, outPath)} (${html.length} bytes)`)
      }
    }
  } finally {
    await browser.close()
    if (typeof server.close === 'function') {
      await server.close()
    } else {
      await new Promise(resolve => server.httpServer.close(resolve))
    }
  }
  console.log('[prerender] done')
}

main().catch(err => {
  console.error('[prerender] FAILED:', err)
  process.exit(1)
})
