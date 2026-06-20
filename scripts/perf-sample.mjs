import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from '@playwright/test'

const port = Number(process.env.PERF_SAMPLE_PORT ?? 4173)
const baseUrl = `http://127.0.0.1:${port}/Lacan.js/`
const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))

function startPreview() {
  const child = spawn(
    process.execPath,
    [viteCli, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, BROWSER: 'none' },
    },
  )

  child.stdout.on('data', (chunk) => process.stdout.write(chunk))
  child.stderr.on('data', (chunk) => process.stderr.write(chunk))

  return child
}

async function waitForPreview(timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // Keep polling until preview accepts connections.
    }
    await delay(250)
  }

  throw new Error(`Preview server did not respond at ${baseUrl}`)
}

async function sample(page, label, duration = 1800) {
  return await page.evaluate(async ({ label, duration }) => {
    const intervals = []
    let frames = 0
    let longFrames = 0
    let maxInterval = 0
    let last = performance.now()
    const end = last + duration

    return await new Promise((resolve) => {
      function tick(now) {
        const delta = now - last
        if (frames > 0) {
          intervals.push(delta)
          if (delta > 50) longFrames += 1
          maxInterval = Math.max(maxInterval, delta)
        }

        frames += 1
        last = now

        if (now < end) {
          requestAnimationFrame(tick)
          return
        }

        const sorted = intervals.slice().sort((a, b) => a - b)
        const average = intervals.reduce((sum, item) => sum + item, 0) / Math.max(intervals.length, 1)
        resolve({
          label,
          frames,
          avgMs: Number(average.toFixed(2)),
          p95Ms: Number((sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(2)),
          maxMs: Number(maxInterval.toFixed(2)),
          longFrames,
        })
      }

      requestAnimationFrame(tick)
    })
  }, { label, duration })
}

async function run() {
  const preview = startPreview()
  const results = []

  try {
    await waitForPreview()

    const browser = await chromium.launch({ headless: true })
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
    })
    await mobilePage.addInitScript(() => window.localStorage.clear())
    await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' })
    await mobilePage.waitForTimeout(3200)
    results.push(await sample(mobilePage, 'mobile-home-idle'))
    await mobilePage.getByRole('button', { name: '下一页' }).click()
    results.push(await sample(mobilePage, 'mobile-gallery-page-change'))
    await mobilePage.getByRole('button', { name: '上一页' }).click()
    await mobilePage.getByTestId('panel-card-panel-1').click()
    results.push(await sample(mobilePage, 'mobile-focus-open'))
    await mobilePage.close()

    const desktopPage = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    })
    await desktopPage.addInitScript(() => window.localStorage.clear())
    await desktopPage.goto(baseUrl, { waitUntil: 'networkidle' })
    await desktopPage.waitForTimeout(3200)
    results.push(await sample(desktopPage, 'desktop-home-idle'))
    await desktopPage.getByTestId('panel-card-panel-1').click()
    results.push(await sample(desktopPage, 'desktop-focus-open'))
    await desktopPage.close()

    await browser.close()
  } finally {
    preview.kill()
  }

  console.table(results)
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
