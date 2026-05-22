import { expect, test } from '@playwright/test'

test.setTimeout(60_000)

async function navigateToFinalChapter(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="panel-gallery"]')
  await page.screenshot({ path: '.sisyphus/evidence/task-12-pre-entry.png', fullPage: true })

  const galleryGrid = page.locator('[data-testid="panel-gallery"] > div').first()

  await galleryGrid.hover()
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(250)
  await galleryGrid.hover()
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(250)
  await expect(page.getByTestId('progress-indicator')).toContainText('03 / 03')

  const panelNine = page.getByTestId('panel-card-panel-9')
  await expect(panelNine).toBeVisible()
  await page.waitForTimeout(300)

  await panelNine.click({ force: true })
  await expect(page.getByTestId('borromean-mode-view')).toBeVisible()
  await page.screenshot({ path: '.sisyphus/evidence/task-12-active-3d.png', fullPage: true })
}

async function navigateToFinalGalleryPage(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="panel-gallery"]')

  const galleryGrid = page.locator('[data-testid="panel-gallery"] > div').first()

  await galleryGrid.hover()
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(250)
  await galleryGrid.hover()
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(250)

  await expect(page.getByTestId('progress-indicator')).toContainText('03 / 03')
  await expect(page.getByTestId('panel-card-panel-10')).toBeVisible()
}

test('enters and exits the Borromean final chapter', async ({ page }) => {
  await navigateToFinalChapter(page)

  await expect(page.locator('.app-container')).toHaveAttribute('data-borromean-mode', 'true')
  await expect(page.getByTestId('borromean-mode-view').getByTestId('borromean-scene-shell')).toBeVisible()

  await page.getByRole('button', { name: 'EXIT' }).click()

  await expect(page.locator('.app-container')).toHaveAttribute('data-borromean-mode', 'false')
  await expect(page.getByTestId('borromean-mode-view')).toHaveCount(0)
  await page.screenshot({ path: '.sisyphus/evidence/task-12-post-exit.png', fullPage: true })
})

test('opens the 2D Borromean card in the normal focus flow', async ({ page }) => {
  await navigateToFinalGalleryPage(page)

  const panelTen = page.getByTestId('panel-card-panel-10')
  await panelTen.click({ force: true })

  await expect(page.locator('.app-container')).toHaveAttribute('data-borromean-mode', 'false')
  await expect(page.getByTestId('focus-view')).toBeVisible()
  await expect(page.getByTestId('borromean-mode-view')).toHaveCount(0)
  await expect(page.getByTestId('focus-view').getByText('Borromean Knot 2D')).toBeVisible()
})

test('selects a Borromean interaction target', async ({ page }) => {
  await navigateToFinalChapter(page)

  const scene = page.getByTestId('borromean-mode-view').getByTestId('borromean-scene-canvas')
  const box = await scene.boundingBox()

  expect(box).not.toBeNull()

  if (!box) {
    return
  }

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect(page.getByTestId('borromean-mode-view').getByText(/crossing:|overlap:|segment:/)).toBeVisible()
})

test('respects reduced motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await navigateToFinalChapter(page)

  await expect(page.getByTestId('borromean-mode-view').getByTestId('borromean-scene-shell')).toBeVisible()
  await expect(page.getByTestId('borromean-scene-fallback')).toHaveCount(0)
})

test('shows fallback when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext

    HTMLCanvasElement.prototype.getContext = function patchedGetContext(
      contextId: string,
      options?: CanvasRenderingContext2DSettings,
    ) {
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return null
      }

      return originalGetContext.call(this, contextId, options)
    }
  })

  await navigateToFinalChapter(page)
  await expect(page.getByTestId('borromean-scene-fallback')).toBeVisible()
})

test('remains stable through resize and exit while Borromean mode is active', async ({ page }) => {
  await navigateToFinalChapter(page)

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(page.getByTestId('borromean-mode-view')).toBeVisible()

  await page.getByRole('button', { name: 'EXIT' }).click()
  await expect(page.locator('.app-container')).toHaveAttribute('data-borromean-mode', 'false')
})
