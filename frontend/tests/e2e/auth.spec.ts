import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should login with correct credentials', async ({ page }) => {
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', '123456')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('.tech-page-title')).toBeVisible()
  })

  test('should show error with incorrect credentials', async ({ page }) => {
    await page.fill('[name="username"]', 'wrong')
    await page.fill('[name="password"]', 'wrong')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.el-message--error')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', '123456')
    await page.click('button[type="submit"]')
    
    await page.waitForURL('/dashboard')
    await page.click('.user-dropdown')
    await page.click('text=退出登录')
    
    await expect(page).toHaveURL('/login')
  })
})
