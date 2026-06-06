import { expect, test } from '@playwright/test'

test('desktop slide deck supports gallery, focus, timeline, and Borromean views', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')

  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()

  await page.getByTestId('panel-card-panel-1').click()
  await expect(page.getByTestId('focus-view')).toBeVisible()

  await page.mouse.click(20, 20)
  await expect(page.getByTestId('focus-view')).toBeHidden({ timeout: 1_500 })

  await page.mouse.wheel(0, 1_000)
  await expect(page.getByTestId('timeline-view')).toBeVisible()
  await expect(page.getByText('精神分析发展史')).toBeVisible()

  await page.mouse.wheel(0, 1_000)
  await expect(page.getByTestId('borromean-view')).toBeVisible()
  await expect(page.getByRole('heading', { name: '波罗米结' })).toBeVisible()
  await expect(page.getByRole('img', { name: /波罗米结/ })).toBeVisible()
})

test('theme toggle switches to night mode and persists the choice', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()

  const toggle = page.getByTestId('theme-toggle')
  await expect(toggle).toBeVisible()
  await expect(page.locator('.app-container')).toHaveAttribute('data-theme', 'day')

  await toggle.click()
  await expect(page.locator('.theme-crossfade')).toBeVisible()
  await expect(page.locator('.app-container')).toHaveAttribute('data-theme', 'night')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.theme-crossfade')).toBeHidden()

  await page.reload()
  await expect(page.locator('.app-container')).toHaveAttribute('data-theme', 'night')
})

test('title fonts stay aligned across themes and timeline cards', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')

  const headerTitle = page.getByRole('heading', { name: 'LACAN.JS' })
  const dayFontFamily = await headerTitle.evaluate((element) => getComputedStyle(element).fontFamily)
  const dayFontWeight = await headerTitle.evaluate((element) => getComputedStyle(element).fontWeight)

  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('.app-container')).toHaveAttribute('data-theme', 'night')
  await expect(headerTitle).toHaveCSS('font-family', dayFontFamily)
  await expect(headerTitle).toHaveCSS('font-weight', dayFontWeight)
  await expect(page.locator('.theme-crossfade')).toBeHidden()

  await page.mouse.wheel(0, 1_000)
  await expect(page.getByTestId('timeline-view')).toBeVisible()

  const cardTitle = page.getByRole('heading', { name: '弗洛伊德赴巴黎学习' })
  await expect(cardTitle).toHaveCSS('font-family', dayFontFamily)
  await expect(cardTitle).toHaveCSS('font-weight', dayFontWeight)
})

test('mobile viewport resets to gallery instead of an empty desktop-only slide', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')

  await page.mouse.wheel(0, 1_000)
  await expect(page.getByTestId('timeline-view')).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })

  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()
  await expect(page.getByTestId('timeline-view')).toBeHidden()
})
