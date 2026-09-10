import { test, expect } from '@playwright/test'

test.describe('Books Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', '123456')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should display books list', async ({ page }) => {
    await page.goto('/books')
    
    await expect(page.locator('.tech-page-container')).toBeVisible()
    await expect(page.locator('.tech-page-title')).toBeVisible()
    await expect(page.locator('.tech-table')).toBeVisible()
  })

  test('should search books by keyword', async ({ page }) => {
    await page.goto('/books')
    
    const searchInput = page.locator('.search-input input')
    await searchInput.fill('JavaScript')
    await page.click('.search-btn')
    
    await page.waitForTimeout(500)
    await expect(page.locator('.tech-table')).toBeVisible()
  })

  test('should open create book dialog', async ({ page }) => {
    await page.goto('/books')
    
    await page.click('button:has-text("添加图书")')
    await expect(page.locator('.el-dialog')).toBeVisible()
    await expect(page.locator('text=新增图书')).toBeVisible()
  })

  test('should create a new book', async ({ page }) => {
    await page.goto('/books')
    
    await page.click('button:has-text("添加图书")')
    
    await page.fill('[name="isbn"]', '9787115428028')
    await page.fill('[name="title"]', '测试图书')
    await page.fill('[name="author"]', '测试作者')
    await page.fill('[name="quantity"]', '10')
    
    await page.click('button:has-text("保存")')
    
    await expect(page.locator('.el-message--success')).toBeVisible()
  })

  test('should edit a book', async ({ page }) => {
    await page.goto('/books')
    
    const firstEditButton = page.locator('.tech-table .edit-btn').first()
    if (await firstEditButton.isVisible()) {
      await firstEditButton.click()
      
      await expect(page.locator('.el-dialog')).toBeVisible()
      await page.fill('[name="title"]', '更新后的图书')
      await page.click('button:has-text("保存")')
      
      await expect(page.locator('.el-message--success')).toBeVisible()
    }
  })

  test('should delete a book', async ({ page }) => {
    await page.goto('/books')
    
    const firstDeleteButton = page.locator('.tech-table .delete-btn').first()
    if (await firstDeleteButton.isVisible()) {
      await firstDeleteButton.click()
      
      await page.click('button:has-text("确认")')
      
      await expect(page.locator('.el-message--success')).toBeVisible()
    }
  })

  test('should paginate books list', async ({ page }) => {
    await page.goto('/books')
    
    const nextPageButton = page.locator('.el-pagination .btn-next')
    if (await nextPageButton.isEnabled()) {
      await nextPageButton.click()
      await page.waitForTimeout(500)
    }
  })
})
