import { expect, test } from '@playwright/test'

async function openHome(page: import('@playwright/test').Page) {
  await page.goto('/Lacan.js/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
  await expect(page.getByRole('heading', { name: 'LACAN.JS' })).toBeVisible()
}

test('desktop editorial journey exposes eight theory dossiers and natural chapter navigation', async ({ page }) => {
  await openHome(page)

  await expect(page.getByTestId('site-nav')).toBeVisible()
  const portrait = page.getByTestId('hero-portrait')
  await expect(portrait).toBeVisible()
  await expect.poll(() => portrait.locator('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(1000)
  const alphaSample = await portrait.locator('img').evaluate(async (image) => {
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) return null
    context.drawImage(image, 0, 0)
    const alphaAt = (x: number, y: number) => context.getImageData(x, y, 1, 1).data[3]
    return {
      transparentBackground: [
        alphaAt(0, 0),
        alphaAt(canvas.width - 1, 0),
        alphaAt(0, Math.floor(canvas.height * 0.35)),
      ],
      center: alphaAt(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)),
      bottomSilhouette: alphaAt(Math.floor(canvas.width / 2), canvas.height - 1),
      chairBack: alphaAt(canvas.width - 2, Math.floor(canvas.height * 0.58)),
    }
  })
  expect(alphaSample?.transparentBackground).toEqual([0, 0, 0])
  expect(alphaSample?.center).toBeGreaterThan(0)
  expect(alphaSample?.bottomSilhouette).toBeGreaterThan(0)
  expect(alphaSample?.chairBack).toBeGreaterThan(0)

  const layerOrder = await page.evaluate(() => ({
    portrait: Number.parseInt(getComputedStyle(document.querySelector('.hero-portrait')!).zIndex, 10),
    far: Number.parseInt(getComputedStyle(document.querySelector('.signifier-machine--far')!).zIndex, 10),
    near: Number.parseInt(getComputedStyle(document.querySelector('.signifier-machine--near')!).zIndex, 10),
  }))
  expect(layerOrder.portrait).toBeGreaterThan(layerOrder.far)
  expect(layerOrder.portrait).toBeGreaterThan(layerOrder.near)
  const [heroBox, portraitBox] = await Promise.all([page.locator('#top').boundingBox(), portrait.boundingBox()])
  expect(heroBox).not.toBeNull()
  expect(portraitBox).not.toBeNull()
  if (heroBox && portraitBox) {
    expect(Math.abs((portraitBox.y + portraitBox.height) - (heroBox.y + heroBox.height))).toBeLessThan(3)
  }
  const signifierAlignment = await page.evaluate(() => {
    const statement = document.querySelector('.hero-statement')!.getBoundingClientRect()
    const chain = document.querySelector('.hero-signifier-chain')!.getBoundingClientRect()
    return { xDifference: Math.abs(statement.x - chain.x), verticalGap: chain.top - statement.bottom }
  })
  expect(signifierAlignment.xDifference).toBeLessThan(1)
  expect(signifierAlignment.verticalGap).toBeGreaterThanOrEqual(0)

  const typewriter = page.getByTestId('hero-typewriter')
  const titleParallax = page.getByTestId('hero-title-parallax')
  const typewriterParallax = page.getByTestId('hero-typewriter-parallax')
  await expect(typewriter).toBeVisible()
  await expect(typewriter).toHaveAttribute('data-quote-count', '10')
  await expect(page.getByTestId('hero-typewriter-cursor')).toHaveCSS('background-color', 'rgb(192, 58, 44)')
  await expect(typewriter).toHaveAttribute('data-phase', 'holding', { timeout: 3000 })
  await expect(page.getByTestId('hero-typewriter-text')).toHaveText('无意识像语言一样被结构。')
  await page.waitForTimeout(1000)
  await expect(page.getByTestId('hero-typewriter-text')).toHaveText('无意识像语言一样被结构。')
  await expect.poll(
    () => typewriter.getAttribute('data-phase'),
    { timeout: 2500, intervals: [50, 50, 100, 100] },
  ).toBe('deleting')
  await expect(typewriter).toHaveAttribute('data-quote-index', '1', { timeout: 2000 })

  const heroBounds = await page.locator('#top').boundingBox()
  expect(heroBounds).not.toBeNull()
  if (heroBounds) {
    await page.mouse.move(heroBounds.x + heroBounds.width * 0.86, heroBounds.y + heroBounds.height * 0.32)
    await expect(portrait).toHaveCSS('transform', 'none')
    await expect.poll(() => titleParallax.evaluate((element) => getComputedStyle(element).transform)).not.toBe('none')
    await expect.poll(async () => {
      const [titleTransform, typewriterTransform] = await Promise.all([
        titleParallax.evaluate((element) => getComputedStyle(element).transform),
        typewriterParallax.evaluate((element) => getComputedStyle(element).transform),
      ])
      return titleTransform === typewriterTransform
    }).toBe(true)
  }

  const exploreLink = page.getByRole('link', { name: '进入理论图式' })
  const staticExploreBox = await exploreLink.boundingBox()
  await expect.poll(() => exploreLink.evaluate((element) => getComputedStyle(element, '::before').clipPath)).toBe('inset(0px 100% 0px 0px)')
  await exploreLink.hover()
  await expect.poll(() => exploreLink.evaluate((element) => getComputedStyle(element, '::before').clipPath)).toBe('inset(0px)')
  await expect.poll(() => exploreLink.locator('.hero-explore-content--inverse').evaluate((element) => getComputedStyle(element).clipPath)).toBe('inset(0px)')
  await expect(exploreLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  const hoverVisual = await exploreLink.evaluate((element) => ({
    sweepColor: getComputedStyle(element, '::before').backgroundColor,
    inverseColor: getComputedStyle(element.querySelector('.hero-explore-content--inverse')!).color,
  }))
  expect(hoverVisual).toEqual({ sweepColor: 'rgb(192, 58, 44)', inverseColor: 'rgb(243, 237, 223)' })
  expect(await exploreLink.boundingBox()).toEqual(staticExploreBox)

  await expect(page.getByTestId('panel-gallery')).toBeVisible()
  await expect(page.locator('[data-testid^="panel-card-panel-"]')).toHaveCount(8)
  await expect(page.getByText('核心图式', { exact: true })).toBeVisible()
  await expect(page.getByText('扩展构造', { exact: true })).toBeVisible()

  const firstPanel = page.getByTestId('panel-card-panel-1')
  await firstPanel.click()
  await expect(page.getByTestId('focus-view')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('主体、大他者与自我')
  await expect(page.getByLabel('关闭理论档案')).toBeFocused()

  await page.getByTestId('schema-node-S').click()
  await page.getByTestId('schema-node-A').click()
  await expect(page.getByTestId('focus-secondary')).toContainText('主体 ↔ 大他者')

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('focus-view')).toBeHidden()
  await expect(firstPanel).toBeFocused()

  await page.getByRole('link', { name: '发展史' }).click()
  await expect(page.getByRole('heading', { name: '精神分析发展史' })).toBeInViewport()
  await expect(page.getByRole('link', { name: '发展史' })).toHaveAttribute('aria-current', 'page')

  await page.getByRole('link', { name: '波罗米结' }).click()
  await expect(page.getByRole('heading', { name: '三界并不叠加，它们彼此锁合' })).toBeInViewport()
  await expect(page.getByRole('link', { name: '波罗米结' })).toHaveAttribute('aria-current', 'page')

  await page.locator('#closing').scrollIntoViewIfNeeded()
  await expect(page.getByRole('heading', { name: '而是让主体听见， 自己话语中的裂缝。' })).toBeVisible()
  await expect(page.getByText('本页为理论导览，不构成心理治疗或临床建议。')).toHaveCount(0)
  const forumLink = page.getByRole('link', { name: '觉心精神分析论坛' })
  await expect(forumLink).toHaveAttribute('href', 'https://juexin.mikansei.cn/zh')
  await expect(forumLink).toHaveCSS('text-decoration-line', 'underline')
  await forumLink.hover()
  await expect(forumLink).toHaveCSS('color', 'rgb(192, 58, 44)')
  await page.getByTestId('closing-back-to-top').click()
  await expect(page.getByRole('heading', { name: 'LACAN.JS' })).toBeInViewport()
})

test('extended constructions provide concept-specific interactions', async ({ page }) => {
  await openHome(page)

  await page.getByTestId('panel-card-panel-5').click()
  await page.getByTestId('discourse-control-analyst').click()
  await expect(page.getByTestId('focus-secondary')).toContainText('分析家话语')
  await page.getByLabel('关闭理论档案').click()

  await page.getByTestId('panel-card-panel-6').click()
  await page.getByTestId('sexuation-formula-right_not_all').click()
  await expect(page.getByTestId('focus-secondary')).toContainText('并非全部受制')
  await page.getByLabel('关闭理论档案').click()

  await page.getByTestId('panel-card-panel-7').click()
  await page.getByTestId('optical-observer-control').fill('80')
  await expect(page.getByTestId('focus-secondary')).toContainText('虚像区')
  await page.getByLabel('关闭理论档案').click()

  await page.getByTestId('panel-card-panel-8').click()
  await page.getByTestId('topology-control-crosscap').click()
  await expect(page.getByTestId('focus-secondary')).toContainText('交叉帽')
})

test('theme and language switches persist without changing the editorial hierarchy', async ({ page }) => {
  await openHome(page)
  const app = page.locator('.app-container')

  await expect(app).toHaveAttribute('data-theme', 'day')
  await expect(app).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByText('阅读关系，而不是孤立的概念')).toBeVisible()

  await page.getByTestId('theme-toggle').click()
  await expect(app).toHaveAttribute('data-theme', 'night')
  await expect(page.getByTestId('theme-toggle')).toHaveAttribute('aria-pressed', 'true')

  await page.getByTestId('language-toggle').click()
  await expect(app).toHaveAttribute('lang', 'en')
  await expect(page.getByTestId('hero-typewriter')).toHaveAttribute('aria-label', 'The unconscious is structured like a language.')
  await expect(page.getByText('Read relations, not isolated concepts')).toBeVisible()
  await expect(page.getByTestId('panel-card-panel-1')).toContainText('Subject / Other / Ego')
  await expect(page.getByRole('heading', { name: 'It lets the subject hear the fissure in their own speech.' })).toBeAttached()

  await page.reload()
  await expect(app).toHaveAttribute('data-theme', 'night')
  await expect(app).toHaveAttribute('lang', 'en')
})

test('timeline archive and Borromean reading are keyboard-operable', async ({ page }) => {
  await openHome(page)

  await page.locator('#timeline').scrollIntoViewIfNeeded()
  const event = page.getByTestId('timeline-event-card-1885')
  await event.click()
  await expect(page.getByTestId('timeline-modal-card')).toBeVisible()
  await expect(page.getByTestId('timeline-modal-card')).toContainText('弗洛伊德赴巴黎学习')
  await expect(page.getByLabel('关闭事件档案')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('关闭事件档案')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('timeline-modal-card')).toBeHidden()
  await expect(event).toBeFocused()

  await page.locator('#borromean').scrollIntoViewIfNeeded()
  const ringGroup = page.getByRole('group', { name: '选择一个界' })
  await ringGroup.getByRole('button', { name: /符号界/ }).click()
  await expect(page.locator('.borromean-reading')).toContainText('S / 符号界')
  await expect(page.getByTestId('borromean-ring-S')).toHaveAttribute('aria-pressed', 'true')
})

test('mobile layout remains usable across index, dossier, timeline, and knot', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openHome(page)

  await expect(page.getByRole('heading', { name: 'LACAN.JS' })).toBeVisible()
  await expect(page.getByTestId('hero-portrait')).toBeVisible()
  await expect(page.getByTestId('hero-typewriter')).toBeVisible()
  const [mobileHeroBox, mobilePortraitBox] = await Promise.all([
    page.locator('#top').boundingBox(),
    page.getByTestId('hero-portrait').boundingBox(),
  ])
  expect(mobileHeroBox).not.toBeNull()
  expect(mobilePortraitBox).not.toBeNull()
  if (mobileHeroBox && mobilePortraitBox) {
    expect(Math.abs((mobilePortraitBox.y + mobilePortraitBox.height) - (mobileHeroBox.y + mobileHeroBox.height))).toBeLessThan(3)
  }
  await page.getByRole('button', { name: '打开导航菜单' }).click()
  await expect(page.getByTestId('site-nav').getByRole('link', { name: '图式' })).toBeVisible()
  await page.getByRole('button', { name: '关闭导航菜单' }).click()

  await page.getByTestId('panel-card-panel-7').click()
  await expect(page.getByTestId('focus-view')).toBeVisible()
  await expect(page.getByLabel('关闭理论档案')).toBeFocused()
  await page.getByTestId('optical-observer-control').fill('82')
  await expect(page.getByTestId('focus-secondary')).toContainText('虚像区')
  await page.getByLabel('关闭理论档案').click()

  await page.locator('#timeline').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('timeline-event-card-1885').locator('img')).toBeVisible()
  await page.getByTestId('timeline-event-card-1885').click()
  await expect(page.getByTestId('timeline-modal-card')).toBeVisible()
  await page.keyboard.press('Escape')

  await page.locator('#borromean').scrollIntoViewIfNeeded()
  await expect(page.getByRole('heading', { name: '三界并不叠加，它们彼此锁合' })).toBeVisible()
  await expect(page.getByRole('group', { name: '选择一个界' })).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(hasHorizontalOverflow).toBe(false)
})

test('reduced motion keeps content complete and disables smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openHome(page)

  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await expect(page.getByTestId('hero-portrait')).toHaveCSS('transform', 'none')
  await expect(page.getByTestId('hero-title-parallax')).toHaveCSS('transform', 'none')
  await expect(page.getByTestId('hero-typewriter-parallax')).toHaveCSS('transform', 'none')
  await expect(page.getByTestId('hero-typewriter')).toHaveAttribute('data-phase', 'static')
  await expect(page.getByTestId('hero-typewriter-text')).toHaveText('无意识像语言一样被结构。')
  await expect(page.getByTestId('hero-typewriter-cursor')).toHaveCSS('animation-name', 'none')
  await expect(page.getByTestId('panel-card-panel-1')).toBeVisible()
  await page.locator('#borromean').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('borromean-ring-S')).toHaveCSS('stroke-dashoffset', '0px')
  await page.locator('#closing').scrollIntoViewIfNeeded()
  await expect(page.locator('.closing-scene-inner')).toHaveCSS('opacity', '1')
  await expect(page.locator('.closing-scene-inner')).toHaveCSS('transform', 'none')
})
