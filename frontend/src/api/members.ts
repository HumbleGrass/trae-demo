import request from './request'

export interface MemberQuery {
  keyword?: string
  page?: number
  pageSize?: number
}

export interface CreateMemberDto {
  username: string
  password: string
  name: string
  phone: string
  idCard: string
  email?: string
  gender?: string
  birthDate?: string
  borrowLimit?: number
}

export const getMembers = (params: MemberQuery) => {
  return request.get('/members', { params })
}

export const getMember = (id: number) => {
  return request.get(`/members/${id}`)
}

export const createMember = (data: CreateMemberDto) => {
  return request.post('/members', data)
}

export const updateMember = (id: number, data: Partial<CreateMemberDto>) => {
  return request.patch(`/members/${id}`, data)
}

export const deleteMember = (id: number) => {
  return request.delete(`/members/${id}`)
}

export const getMemberProfile = () => {
  return request.get('/members/profile')
}