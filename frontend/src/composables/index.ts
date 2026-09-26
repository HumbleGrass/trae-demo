/**
 * Composables 统一导出
 */

// 科技主题
export {
  useTechTheme,
  getCoverColor,
  getAvatarGradient,
  BOOK_CATEGORY_COLORS,
  AVATAR_GRADIENTS
} from './useTechTheme'

// 日期格式
export {
  useDateFormat,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getRenewDueDate,
  isOverdue,
  getOverdueDays,
  calculateFine
} from './useDateFormat'

// 分页
export { usePagination } from './usePagination'
export type { PaginationOptions, PaginationState } from './usePagination'

// 搜索表单
export { useSearchForm } from './useSearchForm'
