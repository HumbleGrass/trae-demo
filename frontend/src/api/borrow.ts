import request from './request'

export interface BorrowQuery {
  memberId?: number
  bookId?: number
  status?: 'borrowed' | 'returned' | 'overdue'
  page?: number
  pageSize?: number
}

export interface CreateBorrowDto {
  bookId: number
  memberId?: number
}

export interface BorrowRecord {
  id: number
  memberId: number
  member?: {
    id: number
    name: string
    phone: string
  }
  bookId: number
  book?: {
    id: number
    title: string
    author: string
    isbn: string
    category: string
  }
  borrowDate: string
  dueDate: string
  actualReturnDate?: string
  status: 'borrowed' | 'returned' | 'overdue'
  renewCount: number
  createdAt: string
  updatedAt: string
}

export interface OverdueInfo {
  days: number
  fine: number
}

export const getBorrows = (params: BorrowQuery) => {
  return request.get('/borrow', { params })
}

export const getMyBorrows = () => {
  return request.get('/borrow/my')
}

export const getOverdueList = () => {
  return request.get('/borrow/overdue')
}

export const createBorrow = (data: CreateBorrowDto) => {
  return request.post('/borrow', data)
}

export const returnBook = (id: number) => {
  return request.patch(`/borrow/${id}/return`)
}

export const renewBook = (id: number) => {
  return request.patch(`/borrow/${id}/renew`)
}

export const calculateOverdue = (id: number) => {
  return request.get(`/borrow/${id}/calculate-overdue`)
}
