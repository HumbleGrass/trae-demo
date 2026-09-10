import request from '../request'
import type { LoginForm, RegisterForm, LoginResponse } from './types'

export function login(data: LoginForm): Promise<LoginResponse> {
  return request.post('/auth/login', data)
}

export function register(data: RegisterForm): Promise<LoginResponse> {
  return request.post('/auth/register', data)
}

export function getProfile() {
  return request.get('/auth/profile')
}
