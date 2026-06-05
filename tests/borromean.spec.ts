import { expect, test } from '@playwright/test'

test('desktop slide deck supports gallery, focus, timeline, and Borromean views', async ({ page }) => {
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

test('mobile viewport resets to gallery instead of an empty desktop-only slide', async ({ page }) => {
  await page.goto('/')

  await page.mouse.wheel(0, 1_000)
  await expect(page.getByTestId('timeline-view')).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })

  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()
  await expect(page.getByTestId('timeline-view')).toBeHidden()
})
