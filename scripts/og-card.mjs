/**
 * Renders scripts/og-card.html to public/og-card.png (1200x630 Open Graph card).
 * Run manually when the card design changes: node scripts/og-card.mjs
 * The PNG is committed; this is not part of the build.
 */
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, 'og-card.html')
const OUT = path.resolve(__dirname, '..', 'public', 'og-card.png')

const browser = await chromium.launch({ args: ["--disable-lcd-text"] })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(pathToFileURL(SRC).href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const loaded = await page.evaluate(() =>
    ['Italiana', 'JetBrains Mono'].filter(f => !document.fonts.check(`16px "${f}"`))
  )
  if (loaded.length) throw new Error(`Fonts failed to load: ${loaded.join(', ')}`)
  await page.screenshot({ path: OUT, type: 'png' })
  console.log(`[og-card] wrote ${OUT}`)
} finally {
  await browser.close()
}
