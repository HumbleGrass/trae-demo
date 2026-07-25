# Staff Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将工作人员登录页改造成已确认的 Notion 风格编辑式分栏，同时保持所有现有业务行为不变。

**Architecture:** 保留 `frontend/src/views/login/index.vue` 的组件绑定、事件和脚本逻辑，只为登录卡片增加语义化修饰类，并重写当前生效的 scoped SCSS。使用源码契约测试锁定桌面双栏、移动单栏和关键业务绑定，之后通过真实浏览器检查视觉与交互。

**Tech Stack:** Vue 3、TypeScript、SCSS、Element Plus、Vitest、Vue Test Utils、Vite

---

## 文件结构

- Modify: `frontend/src/views/login/index.vue`：增加登录卡片布局 class，替换当前生效的页面级 SCSS。
- Create: `frontend/src/views/login/index.spec.ts`：验证布局契约和关键业务绑定未被移除。
- Delete: `frontend/public/login-layout-directions.html`：删除只用于方案确认的临时视觉对比页。

### Task 1: 锁定编辑式分栏布局契约

**Files:**
- Create: `frontend/src/views/login/index.spec.ts`
- Test: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: 编写失败测试**

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./index.vue', import.meta.url), 'utf8')

describe('staff login page layout contract', () => {
  it('uses the editorial split layout on desktop', () => {
    expect(source).toContain('class="login-card login-card--editorial"')
    expect(source).toMatch(/\.login-card--editorial\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 42fr\) minmax\(0, 58fr\)/)
  })

  it('collapses the editorial layout to one column on mobile', () => {
    expect(source).toMatch(/@media \(max-width: 768px\)[\s\S]*\.login-card--editorial\s*\{[\s\S]*grid-template-columns:\s*1fr/)
  })

  it('keeps the existing login and dialog bindings', () => {
    expect(source).toContain('@submit.prevent="handleLogin"')
    expect(source).toContain('@click="handleLogin"')
    expect(source).toContain('v-model="showRegisterDialog"')
    expect(source).toContain('v-model="showForgotDialog"')
  })
})
```

- [ ] **Step 2: 运行测试并确认 RED**

Run: `npm run test -- src/views/login/index.spec.ts`

Expected: 前两个测试因缺少 `login-card--editorial` 和响应式网格规则而失败；业务绑定测试通过。

- [ ] **Step 3: 检查测试失败原因**

确认失败信息指向缺失的布局 class 或网格声明，而不是文件路径、编码或测试运行环境错误。

### Task 2: 实现桌面编辑式分栏

**Files:**
- Modify: `frontend/src/views/login/index.vue`
- Test: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: 为现有卡片增加布局修饰类**

```vue
<div class="login-card login-card--editorial">
```

不得修改表单字段、`v-model`、校验、点击事件、提交事件或 Dialog 绑定。

- [ ] **Step 2: 将当前生效样式改为双栏工作区**

在第二个 `<style lang="scss" scoped>` 中实现以下完整布局契约：

```scss
.login-wrapper {
  width: min(100%, 1040px);
}

.login-card--editorial {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  grid-template-areas:
    'brand form'
    'brand footer';
  grid-template-rows: 1fr auto;
  min-height: 620px;
}

.card-header {
  grid-area: brand;
  color: var(--text-on-inverted);
  background: var(--color-secondary);
}

.card-body {
  grid-area: form;
}

.card-footer {
  grid-area: footer;
}
```

其余控件样式必须使用已有 `--color-*`、`--space-*`、`--radius-*`、`--shadow-*` 与 `--transition-*` 变量。隐藏粒子、网格、全息和扫描线节点；不新增全局 `!important`。

- [ ] **Step 3: 完成控件与状态样式**

```scss
:deep(.el-input__wrapper) {
  min-height: var(--control-height-lg);
  border-radius: var(--radius-xs);
  box-shadow: 0 0 0 1px var(--border-default) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary) inset, var(--shadow-focus);
}

.login-button:focus-visible,
.social-btn:focus-visible,
.forgot-link:focus-visible,
.register-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

保留现有加载 spinner、禁用状态、链接、快捷登录按钮和安全提示。

- [ ] **Step 4: 运行测试并确认 GREEN**

Run: `npm run test -- src/views/login/index.spec.ts`

Expected: 3 个测试全部通过。

### Task 3: 实现响应式布局并清理临时视觉稿

**Files:**
- Modify: `frontend/src/views/login/index.vue`
- Delete: `frontend/public/login-layout-directions.html`
- Test: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: 添加平板与手机规则**

```scss
@media (max-width: 900px) {
  .login-card--editorial {
    grid-template-columns: minmax(0, 38fr) minmax(0, 62fr);
  }
}

@media (max-width: 768px) {
  .login-card--editorial {
    grid-template-columns: 1fr;
    grid-template-areas:
      'brand'
      'form'
      'footer';
    min-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-card,
  .spinner {
    animation: none;
  }
}
```

手机品牌区改为紧凑网格，主操作高度保持不小于 `44px`，页面允许自然纵向滚动。

- [ ] **Step 2: 删除临时视觉对比页**

删除 `frontend/public/login-layout-directions.html`，避免设计评审产物进入正式应用。

- [ ] **Step 3: 再次运行定向测试**

Run: `npm run test -- src/views/login/index.spec.ts`

Expected: 3 个测试全部通过。

- [ ] **Step 4: 检查本轮 diff**

Run: `git diff -- frontend/src/views/login/index.vue frontend/src/views/login/index.spec.ts frontend/public/login-layout-directions.html`

Expected: 仅包含登录页 class、局部样式、布局契约测试和临时视觉稿删除；无 API、路由、store 或业务脚本改动。

### Task 4: 全量验证与浏览器验收

**Files:**
- Verify: `frontend/src/views/login/index.vue`
- Verify: `frontend/src/views/login/index.spec.ts`

- [ ] **Step 1: 运行 lint**

Run: `npm run lint`

Expected: 退出码为 0；若存在仓库基线错误，记录具体文件和规则。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: Vite 构建成功并生成 `dist`。

- [ ] **Step 3: 运行前端测试**

Run: `npm run test`

Expected: 测试全部通过；若存在与本次无关的基线失败，记录测试名称和原因。

- [ ] **Step 4: 在真实浏览器验证三个视口**

打开 `http://localhost:5174/login`，分别检查：

- Desktop `1440x900`：`42/58` 分栏完整，卡片不超过最大宽度。
- Tablet `834x1112`：品牌栏收窄，表单和辅助入口无挤压。
- Mobile `390x844`：单栏堆叠，无横向滚动、遮挡或文本溢出。

- [ ] **Step 5: 验证交互状态**

验证密码显示、记住密码、注册弹窗、找回密码弹窗、键盘焦点和回车提交入口。不得使用真实账号提交登录请求。

- [ ] **Step 6: 检查控制台与最终 diff**

Run: `git diff --check`

Expected: 无空白错误；浏览器控制台无本次改动引入的错误。
