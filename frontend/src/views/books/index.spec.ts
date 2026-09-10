import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BooksPage from '@/views/books/index.vue'

// Mock API
vi.mock('@/api/books', () => ({
  getBooks: vi.fn().mockResolvedValue({
    data: {
      list: [
        { id: 1, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', isbn: '9787115428028', quantity: 10 }
      ],
      total: 1
    }
  }),
  getBookCategories: vi.fn().mockResolvedValue({
    data: [
      { id: 1, name: '技术' },
      { id: 2, name: '文学' }
    ]
  })
}))

describe('BooksPage Integration Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads books on mount', async () => {
    const wrapper = mount(BooksPage)
    await wrapper.vm.$nextTick()
    
    // 验证页面加载后显示图书列表
    expect(wrapper.find('.tech-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('JavaScript高级程序设计')
  })

  it('searches books by keyword', async () => {
    const wrapper = mount(BooksPage)
    await wrapper.vm.$nextTick()
    
    // 模拟搜索操作
    const searchInput = wrapper.find('input')
    await searchInput.setValue('JavaScript')
    await wrapper.find('.search-btn').trigger('click')
    
    // 验证搜索后页面内容
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('JavaScript高级程序设计')
  })

  it('opens create book dialog', async () => {
    const wrapper = mount(BooksPage)
    await wrapper.vm.$nextTick()
    
    // 点击新增图书按钮
    await wrapper.find('button:has-text("添加图书")').trigger('click')
    
    // 验证对话框打开
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-dialog').exists()).toBe(true)
    expect(wrapper.find('text=新增图书').exists()).toBe(true)
  })

  it('handles pagination', async () => {
    const wrapper = mount(BooksPage)
    await wrapper.vm.$nextTick()
    
    // 验证分页组件存在
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })
})
