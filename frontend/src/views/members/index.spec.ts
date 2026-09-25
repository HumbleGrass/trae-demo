import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MembersPage from '@/views/members/index.vue'

// Mock API：返回裸响应包裹，列表为 { data: [], total }
vi.mock('@/api/members', () => ({
  getMembers: vi.fn().mockResolvedValue({
    code: 200,
    message: 'ok',
    data: {
      data: [
        { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138000', status: 'active', borrowLimit: 5 }
      ],
      total: 1
    }
  })
}))

describe('MembersPage Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads members on mount', async () => {
    const wrapper = mount(MembersPage)
    await flushAll()

    expect(wrapper.find('.tech-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('张三')
  })

  it('searches members by keyword', async () => {
    const wrapper = mount(MembersPage)
    await flushAll()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('张三')
    await wrapper.find('button').trigger('click')
    await flushAll()

    expect(wrapper.text()).toContain('张三')
  })

  it('opens member edit dialog', async () => {
    const wrapper = mount(MembersPage)
    await flushAll()

    // 会员页面通过行内「编辑」按钮打开编辑弹窗（模板无「添加会员」入口）
    const buttons = wrapper.findAll('button')
    const editButton = buttons.find((b) => b.text().includes('编辑'))
    expect(editButton).toBeTruthy()
    await editButton!.trigger('click')
    await flushAll()

    expect(wrapper.find('.el-dialog').exists()).toBe(true)
    expect(wrapper.text()).toContain('members.editMember')
  })

  it('handles pagination', async () => {
    const wrapper = mount(MembersPage)
    await flushAll()

    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })
})

/** 冲刷微任务队列，让挂载后的异步数据加载与渲染完成 */
async function flushAll() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}
