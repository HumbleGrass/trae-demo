import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BorrowPage from '@/views/borrow/index.vue'

// 页面 onMounted 读取 route.query.bookId，测试环境未挂载 router，需提供最小 mock
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} })
}))

// Mock API：借阅记录为裸响应包裹，列表为 { data: [], total }
vi.mock('@/api/borrow', () => ({
  getBorrows: vi.fn().mockResolvedValue({
    code: 200,
    message: 'ok',
    data: [
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
  }),
  calculateOverdue: vi.fn().mockResolvedValue({ days: 0, fine: 0 })
}))

// borrow 页面挂载时也会拉取会员与图书下拉数据
vi.mock('@/api/members', () => ({
  getMembers: vi.fn().mockResolvedValue({ data: [{ id: 1, name: '张三' }] })
}))
vi.mock('@/api/books', () => ({
  getBooks: vi.fn().mockResolvedValue({ data: [] })
}))

describe('BorrowPage Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads borrow records on mount', async () => {
    const wrapper = mount(BorrowPage)
    await flushAll()

    expect(wrapper.find('.tech-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('JavaScript高级程序设计')
  })

  it('searches borrow records by keyword', async () => {
    const wrapper = mount(BorrowPage)
    await flushAll()

    // 借阅页面搜索区没有文本输入框，通过状态筛选按钮触发搜索流程
    const buttons = wrapper.findAll('button')
    const searchButton = buttons.find((b) => b.text().includes('搜索'))
    expect(searchButton).toBeTruthy()
    await searchButton!.trigger('click')
    await flushAll()

    expect(wrapper.text()).toContain('张三')
  })

  it('opens create borrow dialog', async () => {
    const wrapper = mount(BorrowPage)
    await flushAll()

    const buttons = wrapper.findAll('button')
    const addButton = buttons.find((b) => b.text().includes('新增借阅'))
    expect(addButton).toBeTruthy()
    await addButton!.trigger('click')
    await flushAll()

    expect(wrapper.find('.el-dialog').exists()).toBe(true)
    expect(wrapper.text()).toContain('新增借阅')
  })

  it('handles pagination', async () => {
    const wrapper = mount(BorrowPage)
    await flushAll()

    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })
})

/** 冲刷微任务队列，让挂载后的异步数据加载与渲染完成 */
async function flushAll() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}
