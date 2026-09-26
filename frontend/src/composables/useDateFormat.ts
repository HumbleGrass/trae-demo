/**
 * 日期格式化相关的 composable
 * @description 提供日期格式化、逾期判断、罚金计算等通用工具函数
 */

/**
 * 格式化为固定分隔符的日期字符串（避免 toLocaleDateString 受 Node 环境 locale 影响）
 * @param dateStr - 日期字符串或 Date 对象
 * @returns YYYY-MM-DD 格式字符串，入参为空返回 '-'
 */
function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 格式化日期
 * @param dateStr - 日期字符串或 Date 对象
 * @returns YYYY-MM-DD 格式字符串
 */
export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return '-'
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return toIsoDate(date)
}

/**
 * 格式化日期时间
 * @param dateStr - 日期字符串或 Date 对象
 * @returns YYYY-MM-DD HH:mm:ss 格式字符串
 */
export function formatDateTime(dateStr?: string | Date): string {
  if (!dateStr) return '-'
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${toIsoDate(date)} ${h}:${min}:${s}`
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
 * @returns 新的到期日期字符串（YYYY-MM-DD）
 */
export function getRenewDueDate(dueDate: string | Date, days: number = 7): string {
  const date = typeof dueDate === 'string' ? new Date(dueDate) : new Date(dueDate.getTime())
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
 * @returns 逾期天数（正数表示逾期，0 或负数表示未逾期）
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
 * 计算罚金
 * @param dateOrOverdueDays - 到期日期，或已计算好的逾期天数
 * @param second - 归还日期；当第一个参数为逾期天数时表示每日罚金费率
 * @param rate - 每日罚金，默认 0.5 元
 * @returns 罚金金额
 */
export function calculateFine(
  dateOrOverdueDays: number | string | Date,
  second?: number | string | Date,
  rate: number = 0.5
): number {
  const overdueDays =
    typeof dateOrOverdueDays === 'number'
      ? dateOrOverdueDays
      : getOverdueDays(dateOrOverdueDays, second as string | Date | undefined)
  return overdueDays <= 0 ? 0 : overdueDays * rate
}

/**
 * 日期相关的 composable
 * @returns 日期工具函数集合
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
