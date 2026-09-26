import { describe, it, expect } from 'vitest'
import { usePagination } from './usePagination'

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { page, pageSize, total } = usePagination()
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(20)
    expect(total.value).toBe(0)
  })

  it('calculates totalPages correctly', () => {
    const { total, totalPages, setTotal } = usePagination()
    setTotal(100)
    expect(totalPages.value).toBe(5)
  })

  it('calculates totalPages with remainder', () => {
    const { total, totalPages, setTotal } = usePagination()
    setTotal(105)
    expect(totalPages.value).toBe(6)
  })

  it('updates page correctly', () => {
    const { page, setPage } = usePagination()
    setPage(3)
    expect(page.value).toBe(3)
  })

  it('updates pageSize correctly', () => {
    const { pageSize, setPageSize } = usePagination()
    setPageSize(50)
    expect(pageSize.value).toBe(50)
  })

  it('resets to default values', () => {
    const { page, pageSize, total, setTotal, setPage, reset } = usePagination()
    setTotal(100)
    setPage(3)
    reset()
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(20)
    expect(total.value).toBe(0)
  })
})
