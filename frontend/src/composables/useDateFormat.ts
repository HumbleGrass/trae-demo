/**
 * 日期格式化相关的 composable
 * @description 提供日期格式化、计算等功能
 */

/**
 * 格式化日期为中文本地格式
 * @param dateStr - 日期字符串或 Date 对象
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  dateStr?: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
): string {
  if (!dateStr) return '-'
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return date.toLocaleDateString('zh-CN', options)
}

/**
 * 格式化日期时间
 * @param dateStr - 日期字符串或 Date 对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateStr?: string | Date): string {
  if (!dateStr) return '-'
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 计算相对时间（如 "3天前"）
 * @param dateStr - 日期字符串或 Date 对象
 * @returns 相对时间字符串
 */
export function formatRelativeTime(dateStr?: string | Date): string {
  if (!dateStr) return '-'
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}天前`
  if (diffHours > 0) return `${diffHours}小时前`
  if (diffMins > 0) return `${diffMins}分钟前`
  return '刚刚'
}

/**
 * 获取续借后的日期
 * @param dueDate - 原到期日期
 * @param days - 续借天数，默认 7 天
 * @returns 新的到期日期字符串
 */
export function getRenewDueDate(dueDate: string | Date, days: number = 7): string {
  const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

/**
 * 检查是否逾期
 * @param dueDate - 到期日期
 * @param returnDate - 归还日期（可选，未归还则使用当前时间）
 * @returns 是否逾期
 */
export function isOverdue(dueDate: string | Date, returnDate?: string | Date): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const now = returnDate
    ? (typeof returnDate === 'string' ? new Date(returnDate) : returnDate)
    : new Date()
  return now > due
}

/**
 * 计算逾期天数
 * @param dueDate - 到期日期
 * @param returnDate - 归还日期（可选，未归还则使用当前时间）
 * @returns 逾期天数（正数表示逾期，0或负数表示未逾期）
 */
export function getOverdueDays(dueDate: string | Date, returnDate?: string | Date): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const now = returnDate
    ? (typeof returnDate === 'string' ? new Date(returnDate) : returnDate)
    : new Date()
  const diffMs = now.getTime() - due.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * 计算罚金（每天 0.5 元）
 * @param overdueDays - 逾期天数
 * @param rate - 每日罚金，默认 0.5
 * @returns 罚金金额
 */
export function calculateFine(overdueDays: number, rate: number = 0.5): number {
  if (overdueDays <= 0) return 0
  return overdueDays * rate
}

/**
 * 日期相关的 composable
 */
export function useDateFormat() {
  return {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    getRenewDueDate,
    isOverdue,
    getOverdueDays,
    calculateFine
  }
}
