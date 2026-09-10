export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  email: string
  role?: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  role: string
  phone?: string
  bio?: string
  createdAt?: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}