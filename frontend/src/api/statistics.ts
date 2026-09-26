import request from './request'

export interface DashboardStats {
  todayBorrow: number
  todayReturn: number
  overdueCount: number
  totalBooks: number
  totalMembers: number
  activeBorrows: number
}

export const getDashboardStats = (): Promise<DashboardStats> => {
  return request.get('/statistics/dashboard')
}

export const getBorrowTrend = (months: number = 6) => {
  return request.get('/analytics/borrow-trend', { params: { months } })
}

export const getCategoryDistribution = () => {
  return request.get('/reports/category-distribution')
}

export const getBookRankings = () => {
  return request.get('/analytics/book-rankings')
}

export const getHotBooks = (limit: number = 10) => {
  return request.get('/reports/hot-books', { params: { limit } })
}

export const getMemberGrowth = (months: number = 6) => {
  return request.get('/analytics/member-growth', { params: { months } })
}
