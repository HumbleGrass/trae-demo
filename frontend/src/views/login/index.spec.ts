import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(resolve(process.cwd(), 'src/views/login/index.vue'), 'utf8')

describe('staff login page layout contract', () => {
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
})
