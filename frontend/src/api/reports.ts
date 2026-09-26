import request from './request'

export const getBorrowStats = (startDate?: string, endDate?: string) => {
  return request.get('/reports/borrow-stats', { params: { startDate, endDate } })
}

export const getMonthlyBorrowStats = () => {
  return request.get('/reports/monthly-stats')
}

export const getMemberActivity = (limit: number = 20) => {
  return request.get('/reports/member-activity', { params: { limit } })
}

export const getReaderDemographics = () => {
  return request.get('/analytics/reader-demographics')
}

export const getHotBooks = (limit: number = 10) => {
  return request.get('/reports/hot-books', { params: { limit } })
}
