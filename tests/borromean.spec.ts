import { expect, test } from '@playwright/test'

test('desktop slide deck supports gallery, focus, timeline, and Borromean views', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')

  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()
  await expect(page.getByTestId('home-signature-bar')).toContainText('设计：Lumoren')
  await expect(page.getByRole('link', { name: '觉心论坛' })).toHaveAttribute('href', 'https://juexin.mikansei.cn/zh/forum')

  await page.getByTestId('panel-card-panel-1').click()
  await expect(page.getByTestId('focus-view')).toBeVisible()
  await expect(page.getByTestId('home-signature-bar')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByTestId('home-signature-bar')).toHaveCSS('opacity', '0')

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

test('language toggle switches visible copy and persists the choice', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()

  const toggle = page.getByTestId('language-toggle')
  await expect(toggle).toBeVisible()
  await expect(page.locator('.app-container')).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByText('精神分析的空间架构')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toContainText('镜像阶段')

  await toggle.click()
  await expect(page.locator('.app-container')).toHaveAttribute('lang', 'en')
  await expect(page.getByText('The Spatial Architecture of Psychoanalysis')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toContainText('Mirror Stage')
  await expect(page.getByRole('link', { name: 'Juexin Forum' })).toBeVisible()

  await page.reload()
  await expect(page.locator('.app-container')).toHaveAttribute('lang', 'en')
  await expect(page.getByText('The Spatial Architecture of Psychoanalysis')).toBeVisible()
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

  await cardTitle.click()
  const modalCard = page.getByTestId('timeline-modal-card')
  await expect(modalCard).toBeVisible()
  await expect(modalCard).toHaveCSS('backdrop-filter', 'blur(18px) saturate(1.1)')
  await expect(modalCard).toHaveCSS('background-image', /rgba\(23, 23, 27, 0\.96\)/)
})

test('mobile viewport uses a full vertical three-page experience', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-4')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-5')).toBeHidden()
  await expect(page.getByTestId('home-signature-bar')).toBeVisible()

  const firstCardBox = await page.getByTestId('panel-card-panel-1').boundingBox()
  const secondCardBox = await page.getByTestId('panel-card-panel-2').boundingBox()
  expect(firstCardBox?.width).toBeGreaterThan(280)
  expect(secondCardBox?.y).toBeGreaterThan((firstCardBox?.y ?? 0) + (firstCardBox?.height ?? 0))

  await page.getByRole('button', { name: '下一页' }).click()
  await expect(page.getByText('第 02 / 02 页')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-5')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-8')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeHidden()

  await page.getByRole('button', { name: '上一页' }).click()
  await expect(page.getByText('第 01 / 02 页')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()

  await page.getByTestId('panel-card-panel-1').click()
  await expect(page.getByTestId('focus-view')).toBeVisible()
  await expect(page.getByTestId('mobile-focus-close')).toBeVisible()
  await page.getByTestId('mobile-focus-close').click()
  await expect(page.getByTestId('focus-view')).toBeHidden({ timeout: 1_500 })

  await page.getByTestId('mobile-timeline-section').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('timeline-view')).toBeVisible()
  await expect(page.getByRole('heading', { name: '精神分析发展史' })).toBeVisible()
  await page.getByTestId('timeline-event-card-1885').click()
  await expect(page.getByTestId('timeline-modal-card')).toBeVisible()
  await page.getByRole('button', { name: '关闭' }).click()
  await expect(page.getByTestId('timeline-modal-card')).toBeHidden()

  await page.getByTestId('mobile-borromean-section').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('borromean-view')).toBeVisible()
  await expect(page.getByRole('heading', { name: '波罗米结' })).toBeVisible()

  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('.app-container')).toHaveAttribute('data-theme', 'night')
  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.getByTestId('timeline-view')).toBeVisible()
  await expect(page.getByTestId('borromean-view')).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(hasHorizontalOverflow).toBe(false)
})
