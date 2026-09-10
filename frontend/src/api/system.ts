import request from './request'

export interface SystemConfig {
  id: number
  systemName: string
  maxBorrow: number
  borrowDays: number
  reserveExpireHours: number
  finePerDay: number
  maxRenewCount: number
}

export const getSystemConfig = (): Promise<SystemConfig> => {
  return request.get('/system/config')
}

export const updateSystemConfig = (data: Partial<SystemConfig>) => {
  return request.patch('/system/config', data)
}
