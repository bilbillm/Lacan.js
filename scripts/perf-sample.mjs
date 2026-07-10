import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from '@playwright/test'

const port = Number(process.env.PERF_SAMPLE_PORT ?? 4473)
const baseUrl = `http://127.0.0.1:${port}/Lacan.js/`
const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const maxP95Ms = Number(process.env.PERF_MAX_P95_MS ?? 34)
const maxLongFrames = Number(process.env.PERF_MAX_LONG_FRAMES ?? 2)

function startPreview() {
  const child = spawn(process.execPath, [viteCli, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, BROWSER: 'none' },
  })
  child.stdout.on('data', (chunk) => process.stdout.write(chunk))
  child.stderr.on('data', (chunk) => process.stderr.write(chunk))
  return child
}

async function waitForPreview(timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl)
      const html = response.ok ? await response.text() : ''
      if (html.includes('<title>Lacan.js</title>')) return
    } catch {
      // Preview may still be starting.
    }
    await delay(250)
  }
  throw new Error(`Preview server did not respond at ${baseUrl}`)
}

async function sample(page, label, duration = 1800) {
  return await page.evaluate(async ({ label: sampleLabel, duration: sampleDuration }) => {
    const intervals = []
    let frames = 0
    let longFrames = 0
    let maxInterval = 0
    let last = performance.now()
    const end = last + sampleDuration

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
          label: sampleLabel,
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

async function sampleViewport(browser, viewport, prefix) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: prefix === 'mobile' })
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const results = [await sample(page, `${prefix}-hero-idle`)]

  await page.getByTestId('panel-card-panel-1').click()
  results.push(await sample(page, `${prefix}-dossier-open`))
  await page.getByLabel('关闭理论档案').click()

  await page.locator('#timeline').evaluate((element) => element.scrollIntoView({ block: 'start' }))
  results.push(await sample(page, `${prefix}-timeline-scroll`))

  await page.locator('#borromean').evaluate((element) => element.scrollIntoView({ block: 'center' }))
  results.push(await sample(page, `${prefix}-borromean-draw`))
  await page.close()
  return results
}

async function run() {
  const preview = startPreview()
  try {
    await waitForPreview()
    const browser = await chromium.launch({ headless: true })
    const results = [
      ...await sampleViewport(browser, { width: 390, height: 844 }, 'mobile'),
      ...await sampleViewport(browser, { width: 1440, height: 900 }, 'desktop'),
    ]
    await browser.close()

    console.table(results)
    const failures = results.filter((result) => result.p95Ms > maxP95Ms || result.longFrames > maxLongFrames)
    if (failures.length > 0) {
      throw new Error(`Performance budget exceeded: ${failures.map((result) => result.label).join(', ')}`)
    }
  } finally {
    preview.kill()
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
