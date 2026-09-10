import request from './request'

export interface Reservation {
  id: number
  bookId: number
  memberId: number
  status: string
  reserveDate: string
  expireDate: string
  book?: {
    id: number
    title: string
    author: string
  }
  member?: {
    id: number
    name: string
  }
}

export interface CreateReservationDto {
  bookId: number
}

export const getReservations = (params?: { status?: string }): Promise<{ data: Reservation[]; total: number }> => {
  return request.get('/reservations', { params })
}

export const getMyReservations = (): Promise<Reservation[]> => {
  return request.get('/reservations/my')
}

export const createReservation = (data: CreateReservationDto) => {
  return request.post('/reservations', data)
}

export const cancelReservation = (id: number) => {
  return request.patch(`/reservations/${id}/cancel`)
}

export const getAllReservations = (params?: { page?: number; pageSize?: number; status?: string }) => {
  return request.get('/reservations/all', { params })
}
