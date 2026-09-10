import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getProfile } from '@/api/auth/index'
import type { LoginForm, RegisterForm, UserInfo } from '@/api/auth/types'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const role = ref<string>('')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'admin')
  const userId = computed(() => userInfo.value?.id)

  async function loginAction(formData: LoginForm) {
    const res = await login(formData)
    token.value = res.token
    userInfo.value = res.user
    role.value = res.user.role
    localStorage.setItem('token', res.token)
    return res
  }

  async function registerAction(formData: RegisterForm) {
    const res = await register(formData)
    token.value = res.token
    userInfo.value = res.user
    role.value = res.user.role
    localStorage.setItem('token', res.token)
    return res
  }

  async function getUserInfoAction() {
    if (!token.value) return
    try {
      const res = await getProfile()
      userInfo.value = res
      role.value = res.role
    } catch (error) {
      // silently ignore
    }
  }

  function logoutAction() {
    token.value = ''
    userInfo.value = null
    role.value = ''
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    role,
    isLoggedIn,
    isAdmin,
    userId,
    loginAction,
    registerAction,
    getUserInfoAction,
    logoutAction
  }
})