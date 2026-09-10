import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from './index.vue'

const source = readFileSync(resolve(process.cwd(), 'src/views/login/index.vue'), 'utf8')
const mainSource = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8')
const fontTokens = readFileSync(resolve(process.cwd(), 'src/styles/_notion-values.scss'), 'utf8')
const loginFormSource = source.match(/<el-form[\s\S]*?class="login-form"[\s\S]*?<\/el-form>/)?.[0] ?? ''

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

describe('staff login page layout contract', () => {
  beforeEach(() => {
    loginActionMock.mockReset()
    logoutActionMock.mockReset()
  })

  it('uses the editorial split layout on desktop', () => {
    expect(source).toContain('class="login-card login-card--editorial"')
    expect(source).toMatch(
      /\.login-card--editorial\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 42fr\) minmax\(0, 58fr\)/
    )
  })

  it('collapses the editorial layout to one column on mobile', () => {
    expect(source).toMatch(
      /@media \(max-width: 768px\)[\s\S]*\.login-card--editorial\s*\{[\s\S]*grid-template-columns:\s*1fr/
    )
  })

  it('constrains login dialogs to the mobile viewport', () => {
    expect(source).toMatch(
      /:global\(\.tech-dialog\.el-dialog\)\s*\{[\s\S]*width:\s*min\(480px, calc\(100vw - 32px\)\)/
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

  it('uses accessible secondary actions and footer contrast', () => {
    expect(source).toContain('<button type="button" class="forgot-link"')
    expect(source).toContain('<button type="button" class="register-link"')
    expect(source).toMatch(
      /\.forgot-link,[\s\S]*\.register-link\s*\{[\s\S]*min-height:\s*var\(--control-height-lg\)/
    )
    expect(source).toMatch(/\.card-footer\s*\{[\s\S]*color:\s*var\(--text-muted\)/)
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
})
