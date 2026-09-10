import { describe, it, expect } from 'vitest'
import { useDateFormat } from './useDateFormat'

describe('useDateFormat', () => {
  it('formats date correctly', () => {
    const { formatDate } = useDateFormat()
    const date = new Date('2026-04-15')
    expect(formatDate(date)).toBe('2026-04-15')
  })

  it('formats date and time correctly', () => {
    const { formatDateTime } = useDateFormat()
    const date = new Date('2026-04-15T10:30:00')
    expect(formatDateTime(date)).toBe('2026-04-15 10:30:00')
  })

  it('calculates relative time correctly', () => {
    const { formatRelativeTime } = useDateFormat()
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(yesterday)).toContain('天前')
  })

  it('checks if date is overdue', () => {
    const { isOverdue } = useDateFormat()
    const pastDate = new Date('2026-04-01')
    const futureDate = new Date('2026-04-20')
    expect(isOverdue(pastDate)).toBe(true)
    expect(isOverdue(futureDate)).toBe(false)
  })

  it('calculates overdue days correctly', () => {
    const { getOverdueDays } = useDateFormat()
    const pastDate = new Date('2026-04-10')
    const today = new Date('2026-04-15')
    const days = getOverdueDays(pastDate, today)
    expect(days).toBe(5)
  })

  it('calculates fine correctly', () => {
    const { calculateFine } = useDateFormat()
    const pastDate = new Date('2026-04-10')
    const today = new Date('2026-04-15')
    const fine = calculateFine(pastDate, today, 0.5)
    expect(fine).toBe(2.5)
  })

  it('calculates renew due date correctly', () => {
    const { getRenewDueDate } = useDateFormat()
    const borrowDate = new Date('2026-04-01')
    const renewDate = getRenewDueDate(borrowDate, 30)
    const expectedDate = new Date('2026-05-01')
    expect(renewDate.toDateString()).toBe(expectedDate.toDateString())
  })
})
