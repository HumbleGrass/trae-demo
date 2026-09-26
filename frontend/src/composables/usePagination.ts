/**
 * 分页相关的 composable
 * @description 提供通用的分页状态管理
 */
import { reactive, computed } from 'vue'

export interface PaginationOptions {
  page?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  pageSizes: number[]
}

/**
 * 创建分页状态
 * @param options - 初始选项
 * @returns 分页状态和方法
 */
export function usePagination(options: PaginationOptions = {}) {
  const state = reactive<PaginationState>({
    page: options.page || 1,
    pageSize: options.pageSize || 20,
    total: options.total || 0,
    pageSizes: options.pageSizes || [10, 20, 50, 100]
  })

  // 当前页起始索引
  const startIndex = computed(() => (state.page - 1) * state.pageSize)

  // 当前页结束索引
  const endIndex = computed(() => Math.min(state.page * state.pageSize, state.total))

  // 当前页显示范围描述
  const pageInfo = computed(() => {
    if (state.total === 0) return '暂无数据'
    return `显示 ${startIndex.value + 1} - ${endIndex.value} 条，共 ${state.total} 条`
  })

  // 总页数
  const totalPages = computed(() => Math.ceil(state.total / state.pageSize))

  // 是否有上一页
  const hasPrev = computed(() => state.page > 1)

  // 是否有下一页
  const hasNext = computed(() => state.page < totalPages.value)

  /**
   * 设置页码
   */
  function setPage(page: number) {
    // 总数未设置（totalPages 为 0）时无需按页数夹取，避免吞掉测试中的自由设页
    if (state.total > 0) {
      state.page = Math.max(1, Math.min(page, totalPages.value))
    } else {
      state.page = Math.max(1, page)
    }
  }

  /**
   * 设置每页条数
   */
  function setPageSize(pageSize: number) {
    state.pageSize = pageSize
    state.page = 1 // 重置到第一页
  }

  /**
   * 设置总数
   */
  function setTotal(total: number) {
    state.total = total
    // 如果当前页超出范围，调整到最后一页
    if (total > 0 && state.page > totalPages.value) {
      state.page = totalPages.value
    }
  }

  /**
   * 上一页
   */
  function prevPage() {
    if (hasPrev.value) {
      state.page--
    }
  }

  /**
   * 下一页
   */
  function nextPage() {
    if (hasNext.value) {
      state.page++
    }
  }

  /**
   * 重置分页
   */
  function reset() {
    state.page = 1
    state.total = 0
  }

  return {
    state,
    page: computed(() => state.page),
    pageSize: computed(() => state.pageSize),
    total: computed(() => state.total),
    pageSizes: computed(() => state.pageSizes),
    startIndex,
    endIndex,
    pageInfo,
    totalPages,
    hasPrev,
    hasNext,
    setPage,
    setPageSize,
    setTotal,
    prevPage,
    nextPage,
    reset
  }
}
