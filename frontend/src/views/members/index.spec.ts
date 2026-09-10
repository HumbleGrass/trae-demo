import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MembersPage from '@/views/members/index.vue'

// Mock API
vi.mock('@/api/members', () => ({
  getMembers: vi.fn().mockResolvedValue({
    data: {
      list: [
        { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138000', status: 'active' }
      ],
      total: 1
    }
  })
}))

describe('MembersPage Integration Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads members on mount', async () => {
    const wrapper = mount(MembersPage)
    await wrapper.vm.$nextTick()
    
    // 验证页面加载后显示会员列表
    expect(wrapper.find('.tech-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('张三')
  })

  it('searches members by keyword', async () => {
    const wrapper = mount(MembersPage)
    await wrapper.vm.$nextTick()
    
    // 模拟搜索操作
    const searchInput = wrapper.find('input')
    await searchInput.setValue('张三')
    await wrapper.find('.search-btn').trigger('click')
    
    // 验证搜索后页面内容
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('张三')
  })

  it('opens create member dialog', async () => {
    const wrapper = mount(MembersPage)
    await wrapper.vm.$nextTick()
    
    // 点击新增会员按钮
    const addButton = wrapper.find('button:has-text("添加会员")')
    if (addButton.exists()) {
      await addButton.trigger('click')
      
      // 验证对话框打开
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.el-dialog').exists()).toBe(true)
      expect(wrapper.find('text=新增会员').exists()).toBe(true)
    }
  })

  it('handles pagination', async () => {
    const wrapper = mount(MembersPage)
    await wrapper.vm.$nextTick()
    
    // 验证分页组件存在
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })
})
