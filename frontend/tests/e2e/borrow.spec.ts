import { test, expect } from '@playwright/test'

test.describe('Borrow Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', '123456')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should display borrow records', async ({ page }) => {
    await page.goto('/borrow')
    
    await expect(page.locator('.tech-page-container')).toBeVisible()
    await expect(page.locator('.tech-page-title')).toBeVisible()
    await expect(page.locator('.tech-table')).toBeVisible()
  })

  test('should open create borrow dialog', async ({ page }) => {
    await page.goto('/borrow')
    
    const createButton = page.locator('button:has-text("新增借阅")')
    if (await createButton.isVisible()) {
      await createButton.click()
      await expect(page.locator('.el-dialog')).toBeVisible()
      await expect(page.locator('text=新增借阅')).toBeVisible()
    }
  })

  test('should create a borrow record', async ({ page }) => {
    await page.goto('/borrow')
    
    const createButton = page.locator('button:has-text("新增借阅")')
    if (await createButton.isVisible()) {
      await createButton.click()
      
      await page.fill('[name="memberId"]', '1')
      await page.fill('[name="bookId"]', '1')
      
      await page.click('button:has-text("保存")')
      
      await expect(page.locator('.el-message--success')).toBeVisible()
    }
  })

  test('should return a book', async ({ page }) => {
    await page.goto('/borrow')
    
    const returnButton = page.locator('.tech-table .return-btn').first()
    if (await returnButton.isVisible()) {
      await returnButton.click()
      
      await page.click('button:has-text("确认")')
      
      await expect(page.locator('.el-message--success')).toBeVisible()
    }
  })

  test('should renew a book', async ({ page }) => {
    await page.goto('/borrow')
    
    const renewButton = page.locator('.tech-table .renew-btn').first()
    if (await renewButton.isVisible()) {
      await renewButton.click()
      
      await page.click('button:has-text("确认")')
      
      await expect(page.locator('.el-message--success')).toBeVisible()
    }
  })

  test('should filter borrow records by status', async ({ page }) => {
    await page.goto('/borrow')
    
    const statusFilter = page.locator('.status-filter')
    if (await statusFilter.isVisible()) {
      await statusFilter.click()
      await page.click('text=借阅中')
      
      await page.waitForTimeout(500)
      await expect(page.locator('.tech-table')).toBeVisible()
    }
  })
})
