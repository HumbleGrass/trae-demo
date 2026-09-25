import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from './index.vue'

const source = readFileSync(resolve(process.cwd(), 'src/views/login/index.vue'), 'utf8')
const mainSource = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8')
const fontTokens = readFileSync(resolve(process.cwd(), 'src/styles/_notion-values.scss'), 'utf8')
const loginFormSource = source.match(/<el-form[\s\S]*?class="auth-form login-form"[\s\S]*?<\/el-form>/)?.[0] ?? ''

const { loginActionMock, logoutActionMock } = vi.hoisted(() => ({
  loginActionMock: vi.fn(),
  logoutActionMock: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    loginAction: loginActionMock,
    logoutAction: logoutActionMock
  })
}))

vi.mock('@/api/auth/index', () => ({ register: vi.fn() }))

describe('glass login page layout contract', () => {
  beforeEach(() => {
    loginActionMock.mockReset()
    logoutActionMock.mockReset()
    localStorage.clear()
  })

  it('renders the full-bleed four-layer background stack', () => {
    for (const layer of ['bg-layer bg-base', 'bg-layer bg-photo', 'bg-layer bg-scrim', 'bg-layer bg-bloom']) {
      expect(source).toContain(`class="${layer}"`)
    }
    expect(source).toContain("url('/images/login-bg.jpg')")
    expect(existsSync(resolve(process.cwd(), 'public/images/login-bg.jpg'))).toBe(true)
  })

  it('centres a single frosted-glass card on the page', () => {
    expect(source).toMatch(
      /\.login-page\s*\{[\s\S]*display:\s*flex;[\s\S]*align-items:\s*center;[\s\S]*justify-content:\s*center;[\s\S]*min-height:\s*100vh/
    )
    expect(source).toMatch(/\.auth-card\s*\{[\s\S]*width:\s*min\(100%, 420px\)/)
    expect(source).toMatch(
      /\.auth-card\s*\{[\s\S]*-webkit-backdrop-filter:\s*blur\(24px\) saturate\(180%\);[\s\S]*backdrop-filter:\s*blur\(24px\) saturate\(180%\)/
    )
  })

  it('keeps the existing login and dialog bindings', () => {
    expect(source).toContain('@submit.prevent="handleLogin"')
    expect(source).toContain('@click="handleLogin"')
    expect(source).toContain('v-model="showRegisterDialog"')
    expect(source).toContain('v-model="showForgotDialog"')
  })

  it('binds login validation rules to both fields', () => {
    expect(loginFormSource).toMatch(/<el-form-item\s+prop="username"/)
    expect(loginFormSource).toMatch(/<el-form-item\s+prop="password"/)
  })

  it('removes inactive social login controls', () => {
    expect(source).not.toContain('快速登录')
    expect(source).not.toContain('微信登录')
    expect(source).not.toContain('QQ登录')
    expect(source).not.toContain('邮箱登录')
    expect(source).not.toContain('class="social-login"')
    expect(source).not.toContain('.social-login')
    expect(source).not.toContain('.social-btn')
  })

  it('uses accessible secondary actions', () => {
    expect(source).toContain('<button type="button" class="link-btn forgot-link"')
    expect(source).toContain('<button type="button" class="link-btn register-link"')
  })

  it('styles glass dialogs and constrains them to the mobile viewport', () => {
    expect(source).toContain('class="glass-dialog"')
    expect(source).toContain('modal-class="glass-overlay"')
    expect(source).toMatch(
      /:global\(\.glass-dialog\.el-dialog\)\s*\{[\s\S]*width:\s*min\(400px, calc\(100vw - 32px\)\)/
    )
  })

  it('respects reduced motion preferences', () => {
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })

  it('loads Inter globally without declaring unavailable NotionInter', () => {
    for (const weight of ['400', '500', '600', '700']) {
      expect(mainSource).toContain(`@fontsource/inter/${weight}.css`)
    }
    expect(fontTokens).toContain('$font-family-base: \'"Inter"')
    expect(fontTokens).not.toContain('NotionInter')
  })

  it('does not retain legacy font families anywhere in frontend source', () => {
    const srcRoot = resolve(process.cwd(), 'src')
    const legacyFontFiles = readdirSync(srcRoot, { recursive: true, encoding: 'utf8' })
      .filter((relativePath) => /\.(scss|ts|vue)$/.test(relativePath) && !relativePath.endsWith('.spec.ts'))
      .filter((relativePath) => {
        const fileSource = readFileSync(resolve(srcRoot, relativePath), 'utf8')
        return /NotionInter|Orbitron|Rajdhani/.test(fileSource)
      })

    expect(legacyFontFiles).toEqual([])
  })

  it('blocks an empty login before calling the store', async () => {
    const wrapper = mount(LoginPage, {
      global: { plugins: [ElementPlus] }
    })

    await wrapper.get('.login-button').trigger('click')
    await flushPromises()
    await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 150))

    expect(loginActionMock).not.toHaveBeenCalled()
    expect(logoutActionMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('login.usernameRequired')
    expect(wrapper.text()).toContain('login.passwordRequired')
    wrapper.unmount()
  })

  it('restores the remembered username without persisting passwords', async () => {
    localStorage.setItem('zhiyuege.remember', 'alice')

    const wrapper = mount(LoginPage, {
      global: { plugins: [ElementPlus] }
    })
    await flushPromises()

    const usernameInput = wrapper.get('#login-username').element as HTMLInputElement
    expect(usernameInput.value).toBe('alice')
    expect(localStorage.getItem('zhiyuege.password')).toBeNull()
    wrapper.unmount()
  })
})
