import request from './request'

export interface BookQuery {
  keyword?: string
  category?: string
  page?: number
  pageSize?: number
}

export interface CreateBookDto {
  isbn: string
  title: string
  author: string
  category: string
  quantity: number
}

export const getBooks = (params: BookQuery) => {
  return request.get('/books', { params })
}

export const getBook = (id: number) => {
  return request.get(`/books/${id}`)
}

export const createBook = (data: CreateBookDto) => {
  return request.post('/books', data)
}

export const updateBook = (id: number, data: Partial<CreateBookDto>) => {
  return request.patch(`/books/${id}`, data)
}

export const deleteBook = (id: number) => {
  return request.delete(`/books/${id}`)
}
