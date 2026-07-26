# Login Page QA Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove inactive social login controls and fix login validation, touch targets, typography consistency, and footer contrast without changing authentication contracts.

**Architecture:** Keep the existing Vue component and Element Plus form flow. Bind the existing validation rules through `el-form-item`, replace pseudo-links with semantic buttons, remove social-only markup/styles, and route all typography through the existing global font token after loading self-hosted Inter assets.

**Tech Stack:** Vue 3, TypeScript, Element Plus, SCSS, Vitest, @fontsource/inter, Vite, agent-browser.

---

### Task 1: Add failing login-page contract tests

**Files:**
- Modify: `frontend/src/views/login/index.spec.ts`
- Test: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: Write failing tests for the requested behavior**

Add source-contract assertions that require bound form items, semantic action buttons, removal of social login controls, the stronger footer color, Inter imports, and the updated font token. Also mount the real Element Plus form and prove invalid data never reaches the user store:

```ts
const mainSource = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8')
const fontTokens = readFileSync(resolve(process.cwd(), 'src/styles/_notion-values.scss'), 'utf8')

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

it('binds login validation rules to both fields', () => {
  expect(source).toMatch(/<el-form-item\s+prop="username"/)
  expect(source).toMatch(/<el-form-item\s+prop="password"/)
})

it('removes inactive social login controls', () => {
  expect(source).not.toContain('快速登录')
  expect(source).not.toContain('微信登录')
  expect(source).not.toContain('QQ登录')
  expect(source).not.toContain('邮箱登录')
  expect(source).not.toContain('class="social-login"')
})

it('uses accessible secondary actions and footer contrast', () => {
  expect(source).toContain('<button type="button" class="forgot-link"')
  expect(source).toContain('<button type="button" class="register-link"')
  expect(source).toMatch(/\.forgot-link,[\s\S]*\.register-link\s*\{[\s\S]*min-height:\s*var\(--control-height-lg\)/)
  expect(source).toMatch(/\.card-footer\s*\{[\s\S]*color:\s*var\(--text-muted\)/)
})

it('loads Inter globally without declaring unavailable NotionInter', () => {
  for (const weight of ['400', '500', '600', '700']) {
    expect(mainSource).toContain(`@fontsource/inter/${weight}.css`)
  }
  expect(fontTokens).toContain('$font-family-base: \'"Inter"')
  expect(fontTokens).not.toContain('NotionInter')
})

it('blocks an empty login before calling the store', async () => {
  const wrapper = mount(LoginPage, {
    global: { plugins: [ElementPlus] }
  })

  await wrapper.get('.login-button').trigger('click')
  await flushPromises()

  expect(loginActionMock).not.toHaveBeenCalled()
  expect(logoutActionMock).not.toHaveBeenCalled()
  expect(wrapper.text()).toContain('login.usernameRequired')
  expect(wrapper.text()).toContain('login.passwordRequired')
  wrapper.unmount()
})
```

Add these imports at the top of the test:

```ts
import { flushPromises, mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from './index.vue'
```

Reset both store mocks in `beforeEach`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm.cmd test -- src/views/login/index.spec.ts`

Expected: FAIL because the current component still uses ordinary div fields, social controls, pseudo-links, the faint footer token, and no Inter asset imports.

- [ ] **Step 3: Commit the failing test**

```powershell
git add frontend/src/views/login/index.spec.ts
git commit -m "test: cover login QA fixes"
```

### Task 2: Install and load Inter globally

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: `frontend/src/main.ts`
- Modify: `frontend/src/styles/_notion-values.scss`
- Test: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: Install the self-hosted Inter package**

Run: `npm.cmd install @fontsource/inter`

Expected: `@fontsource/inter` appears in dependencies and the lockfile records the resolved version.

- [ ] **Step 2: Load only the weights used by the design system**

Add before application styles in `frontend/src/main.ts`:

```ts
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
```

- [ ] **Step 3: Make Inter the global token source**

Replace the font token in `frontend/src/styles/_notion-values.scss` with:

```scss
$font-family-base: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
```

- [ ] **Step 4: Run the focused test**

Run: `npm.cmd test -- src/views/login/index.spec.ts`

Expected: font assertions pass while the login template/style assertions still fail.

- [ ] **Step 5: Commit the font integration**

```powershell
git add frontend/package.json frontend/package-lock.json frontend/src/main.ts frontend/src/styles/_notion-values.scss
git commit -m "style: load Inter globally"
```

### Task 3: Fix the login template and styles

**Files:**
- Modify: `frontend/src/views/login/index.vue`
- Test: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: Bind the existing rules to Element Plus form items**

Replace both `.form-field` wrappers with `el-form-item` elements:

```vue
<el-form-item prop="username">
  <!-- existing username label and input -->
</el-form-item>

<el-form-item prop="password">
  <!-- existing password label and input -->
</el-form-item>
```

Keep `v-model`, placeholders, password visibility, Enter handling, `rules`, and `handleLogin` unchanged.

- [ ] **Step 2: Replace pseudo-links with semantic buttons**

Use explicit non-submit buttons while preserving dialog state:

```vue
<button type="button" class="forgot-link" @click="showForgotDialog = true">忘记密码？</button>
<button type="button" class="register-link" @click="showRegisterDialog = true">立即注册</button>
```

- [ ] **Step 3: Remove inactive social login markup**

Delete the `.divider` block and `.social-login` block containing the 微信、QQ、邮箱 buttons. Keep `.register-section` directly after the login form.

- [ ] **Step 4: Remove social-only styles and style the remaining actions**

Delete `.divider`, `.social-login`, `.social-btn`, their pseudo-elements, SVG, hover, and focus selectors. Update the remaining action styles:

```scss
.forgot-link,
.register-link {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-height-lg);
  padding: 0 var(--space-xs);
  color: var(--color-primary);
  font: inherit;
  background: transparent;
  border: 0;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.register-section {
  margin-top: var(--space-md);
}

.card-footer {
  color: var(--text-muted);
}
```

Retain focus-visible outlines for `.forgot-link` and `.register-link`.

- [ ] **Step 5: Run the focused test and verify it passes**

Run: `npm.cmd test -- src/views/login/index.spec.ts`

Expected: PASS with all login layout and QA contract tests green.

- [ ] **Step 6: Commit the login fixes**

```powershell
git add frontend/src/views/login/index.vue frontend/src/views/login/index.spec.ts
git commit -m "fix: resolve login page QA issues"
```

### Task 4: Run automated verification

**Files:**
- Verify: `frontend/`

- [ ] **Step 1: Run the complete unit suite**

Run: `npm.cmd test`

Expected: all Vitest tests pass.

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Run the production build**

Run: `npm.cmd run build`

Expected: Vite build exits 0 and emits `dist/` assets including Inter font files.

- [ ] **Step 4: Inspect the focused diff**

Run: `git diff HEAD~3 -- frontend/src/views/login/index.vue frontend/src/views/login/index.spec.ts frontend/src/main.ts frontend/src/styles/_notion-values.scss frontend/package.json frontend/package-lock.json`

Expected: only the requested login fixes and global Inter integration are present.

### Task 5: Verify in agent-browser

**Files:**
- Create: `test_screenshots/agent-browser-login-fixed/desktop-1440x900.png`
- Create: `test_screenshots/agent-browser-login-fixed/tablet-768x1024.png`
- Create: `test_screenshots/agent-browser-login-fixed/mobile-390x844.png`

- [ ] **Step 1: Open a clean agent-browser session**

Run: `agent-browser --session notion-login-fixed open http://localhost:5174/login`

Expected: login page loads without console errors.

- [ ] **Step 2: Verify desktop behavior and typography**

Set 1440x900, take a screenshot, and verify the interactive snapshot contains no 微信、QQ、邮箱 controls. Check `document.fonts` reports loaded Inter faces. Click an empty login button and verify field-level required messages appear with no `/api/v1/auth/login` request.

- [ ] **Step 3: Verify tablet and mobile layout**

Set 768x1024 and 390x844, take screenshots, and verify `scrollWidth` equals viewport width. On mobile, verify both secondary text buttons have bounding-box heights of at least 44px and the footer uses the stronger muted color.

- [ ] **Step 4: Close the session and review evidence**

Run: `agent-browser --session notion-login-fixed errors`, `agent-browser --session notion-login-fixed console`, then `agent-browser --session notion-login-fixed close`.

Expected: no application errors; screenshots show stable layouts at all three sizes.
