import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from './index.vue'

describe('Pagination', () => {
  it('renders pagination with default props', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 20
      }
    })
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })

  it('emits page-change event', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 20
      }
    })
    await wrapper.vm.handlePageChange(2)
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([2])
  })

  it('emits size-change event', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        pageSize: 20
      }
    })
    await wrapper.vm.handleSizeChange(50)
    expect(wrapper.emitted('size-change')).toBeTruthy()
    expect(wrapper.emitted('size-change')?.[0]).toEqual([50])
  })

  it('calculates total pages correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 100,
        limit: 20
      }
    })
    expect(wrapper.vm.totalPages).toBe(5)
  })
})
