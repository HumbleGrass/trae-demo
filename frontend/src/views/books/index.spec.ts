import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BooksPage from '@/views/books/index.vue'

// Mock API：真实后端返回裸形状 { code, message, data }，books 列表为 { data: [], total }
vi.mock('@/api/books', () => ({
  getBooks: vi.fn().mockResolvedValue({
    code: 200,
    message: 'ok',
    data: {
      data: [
        { id: 1, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', isbn: '9787115428028', quantity: 10, availableQuantity: 3 }
      ],
      total: 1
    }
  })
}))

describe('BooksPage Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads books on mount', async () => {
    const wrapper = mount(BooksPage)
    await flushAll()

    expect(wrapper.find('.tech-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('JavaScript高级程序设计')
  })

  it('searches books by keyword', async () => {
    const wrapper = mount(BooksPage)
    await flushAll()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('JavaScript')
    await wrapper.find('button').trigger('click')
    await flushAll()

    expect(wrapper.text()).toContain('JavaScript高级程序设计')
  })

  it('opens create book dialog', async () => {
    const wrapper = mount(BooksPage)
    await flushAll()

    // 点击「添加图书」按钮（i18n 中文文案）
    const addButton = wrapper.findAll('button').find((b) => b.text().includes('添加图书'))
    expect(addButton).toBeTruthy()
    await addButton!.trigger('click')
    await flushAll()

    expect(wrapper.find('.el-dialog').exists()).toBe(true)
    expect(wrapper.text()).toContain('添加图书')
  })

  it('handles pagination', async () => {
    const wrapper = mount(BooksPage)
    await flushAll()

    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })
})

/** 冲刷微任务队列，让挂载后的异步数据加载与渲染完成 */
async function flushAll() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}
