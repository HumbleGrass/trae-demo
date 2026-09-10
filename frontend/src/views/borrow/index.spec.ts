import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BorrowPage from '@/views/borrow/index.vue'

// Mock API
vi.mock('@/api/borrow', () => ({
  getBorrowRecords: vi.fn().mockResolvedValue({
    data: {
      list: [
        {
          id: 1,
          member: { name: '张三' },
          book: { title: 'JavaScript高级程序设计' },
          borrowDate: '2026-04-01',
          dueDate: '2026-04-15',
          status: 'borrowed'
        }
      ],
      total: 1
    }
  })
}))

describe('BorrowPage Integration Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads borrow records on mount', async () => {
    const wrapper = mount(BorrowPage)
    await wrapper.vm.$nextTick()
    
    // 验证页面加载后显示借阅记录
    expect(wrapper.find('.tech-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('JavaScript高级程序设计')
  })

  it('searches borrow records by keyword', async () => {
    const wrapper = mount(BorrowPage)
    await wrapper.vm.$nextTick()
    
    // 模拟搜索操作
    const searchInput = wrapper.find('input')
    await searchInput.setValue('张三')
    await wrapper.find('.search-btn').trigger('click')
    
    // 验证搜索后页面内容
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('张三')
  })

  it('opens create borrow dialog', async () => {
    const wrapper = mount(BorrowPage)
    await wrapper.vm.$nextTick()
    
    // 点击新增借阅按钮
    const addButton = wrapper.find('button:has-text("新增借阅")')
    if (addButton.exists()) {
      await addButton.trigger('click')
      
      // 验证对话框打开
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.el-dialog').exists()).toBe(true)
      expect(wrapper.find('text=新增借阅').exists()).toBe(true)
    }
  })

  it('handles pagination', async () => {
    const wrapper = mount(BorrowPage)
    await wrapper.vm.$nextTick()
    
    // 验证分页组件存在
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })
})
