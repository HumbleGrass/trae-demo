# 图书馆借阅管理系统 · UI 设计系统规范

> **文档版本**：1.0  
> **适用范围**：前端（`frontend/`）  
> **目标读者**：前端开发团队  
> **Style Source of Truth**：根目录 `DESIGN.md`（Notion 风格分析）  
> **Token 源头**：`src/styles/_notion-values.scss` → `src/styles/design-tokens.scss`  
> **状态**：Cyber/Tech 风格清理中，Notion 风格为唯一目标形态

**Companion Docs**：  
- [ADR-0001: Notion 风格作为唯一设计语言](adr/0001-notion-as-single-style.md) — 决策背景与后果  
- [UI 术语表](ui-glossary.md) — 设计系统词汇解释

---

## 目录

1. [设计原则](#1-设计原则)
2. [设计 Token](#2-设计-token)
3. [组件库规范](#3-组件库规范)
4. [页面布局规格](#4-页面布局规格)
5. [交互状态](#5-交互状态)
6. [可访问性](#6-可访问性)
7. [响应式策略](#7-响应式策略)
8. [动画与过渡](#8-动画与过渡)
9. [迁移说明：Cyber → Notion](#9-迁移说明cyber--notion)
10. [附录：Do's and Don'ts](#10附录dos-and-donts)

---

## 1. 设计原则

本项目采用 Notion 风格视觉语言，核心气质是「**温暖纸面 + 安静克制**」。

| # | 原则 | 说明 |
|---|------|------|
| P1 | **单一结构性强调色** | 只允许 `#0075de` (Notion Blue) 承担 CTA、链接、焦点三个角色，不引入第二结构色 |
| P2 | **装饰色只装饰** | 多色 sticker 调色板（紫/粉/橙/青/绿/天蓝）只用于图标、插画分类圆点、封面色块，绝不涂 CTA 或容器 |
| P3 | **纸一样的背景** | 页面底色用 `#f6f5f4` 温暖米白（`--color-canvas-soft`），卡片用纯白 `#ffffff`（`--color-surface`）制造图/地关系 |
| P4 | **细线定义边界** | 默认卡片只有 1px `#e6e6e6` 细线边框（`--color-hairline`），不依赖阴影分层 |
| P5 | **几乎看不见的阴影** | 阴影是多层近乎透明的叠加（详见 Token → Elevation），让卡片像"轻轻浮起"，不是重重落下 |
| P6 | **字重即表达力** | 用 700 粗标题 + 400 常规正文的对比建立层级，不依赖花哨字体或装饰 |
| P7 | **胶囊 vs 圆角的对比** | 营销型 CTA 用全胶囊 `9999px`，操作按钮用 `8px`，表单输入框用 `4px`——三个尺寸表达不同语义 |
| P8 | **留白是主分组手段** | 模块之间靠大段留白分隔，不靠横线或色块 |

---

## 2. 设计 Token

所有 Token 最终都在 `:root` 上暴露为 CSS 自定义属性，SCSS 源头在 `_notion-values.scss`。**新增样式必须引用 Token，禁止硬编码颜色值**。

### 2.1 品牌与表面色（Brand & Surface）

| Token | 值 | 用途 |
|-------|----|------|
| `--color-primary` | `#0075de` | 主 CTA 填充、链接颜色、活动/焦点信号 |
| `--color-primary-active` | `#005bab` | 主 CTA 按下态 |
| `--color-secondary` | `#213183` | 深色英雄区（单页不超过一次） |
| `--color-on-primary` | `#ffffff` | 主 CTA 上的文字 |
| `--color-canvas-soft` | `#f6f5f4` | 页面底色（温暖米白） |
| `--color-canvas` / `--color-surface` | `#ffffff` | 卡片/面板/表单表面 |
| `--color-hairline` | `#e6e6e6` | 1px 边框/分隔线 |

### 2.2 文字色（Text / Ink）

| Token | 值 | 用途 |
|-------|----|------|
| `--color-ink` | `#000000` | 主标题、正文 |
| `--color-ink-secondary` | `#31302e` | 次要正文、页脚文字 |
| `--color-ink-muted` | `#615d59` | 辅助说明、次级信息 |
| `--color-ink-faint` | `#a39e98` | 占位符、元数据、最淡的提示 |

### 2.3 装饰调色板（Decorative Sticker Palette）

**仅用于图标插画、分类圆点、封面色块。严禁作为按钮或容器背景。**

| Token | 值 | 建议用途 |
|-------|----|----------|
| `--color-accent-sky` | `#62aef0` | 信息类图标、标签 |
| `--color-accent-purple` | `#d6b6f6` | 分类插画 |
| `--color-accent-pink` | `#ff64c8` | 分类插画 |
| `--color-accent-orange` | `#dd5b00` | 分类插画 |
| `--color-accent-teal` | `#2a9d99` | 分类插画 |
| `--color-accent-green` | `#1aae39` | 插画装饰 |
| `--color-accent-brown` | `#523410` | 插画装饰 |

### 2.4 语义状态色（Semantic States）

| Token | 值 | 用途 |
|-------|----|------|
| `--color-success` | `#1a7f37` | 成功文字、图标 |
| `--color-success-soft` | `#eaf6ec` | 成功标签/Toast 背景 |
| `--color-success-border` | `#b7dfbd` | 成功标签边框 |
| `--color-warning` | `#9a6700` | 警告文字 |
| `--color-warning-soft` | `#fff8c5` | 警告背景 |
| `--color-warning-border` | `#eac54f` | 警告边框 |
| `--color-danger` | `#cf222e` | 错误/危险文字 |
| `--color-danger-soft` | `#ffebe9` | 危险背景 |
| `--color-danger-border` | `#ffb4ad` | 危险边框 |
| `--color-info` | `var(--color-primary)` | 信息（= Notion Blue） |
| `--color-info-soft` | `#eaf4ff` | 信息背景 |
| `--color-info-border` | `#a8d4fa` | 信息边框 |

### 2.5 排版（Typography）

**字体族**：`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`

| Token | 字号 | 字重 | 行高 | 字距 | 典型用途 |
|-------|------|------|------|------|----------|
| `--font-size-display-1` | 64px | 700 | 1.0 | −2.125px | 登录页英雄标题 |
| `--font-size-display-2` | 54px | 700 | 1.04 | −1.875px | （预留）大节标题 |
| `--font-size-heading-1` | 40px | 700 | 1.1 | −1px | 页面主标题 |
| `--font-size-heading-2` | 26px | 700 | 1.23 | −0.625px | 卡片标题 |
| `--font-size-heading-3` | 22px | 700 | 1.27 | −0.25px | 小节标题 |
| `--font-size-title` | 20px | 600 | 1.4 | −0.125px | 功能名称、调用 |
| `--font-size-body-md` | 16px | 400 | 1.5 | 0 | 默认正文 |
| `--font-size-body-sm` | 15px | 400 | 1.33 | 0 | 表格行、导航 |
| `--font-size-button` | 16px | 500 | 1.5 | 0 | 按钮标签 |
| `--font-size-caption` | 14px | 400 | 1.43 | 0 | 说明、脚注 |
| `--font-size-eyebrow` | 12px | 600 | 1.33 | +0.125px | 胶囊标签、小标识 |

**启用 OpenType 特性**：`"lnum" 1, "locl" 1`（等宽数字、本地化字形）。

### 2.6 间距（Spacing）

基准单位 8px。

| Token | 值 | 典型用途 |
|-------|----|----------|
| `--space-xxs` | 4px | 胶囊标签内边距 |
| `--space-xs` | 8px | 图标与文字间距 |
| `--space-sm` | 12px | 输入框内边距 |
| `--space-md` | 16px | 标准模块间距 |
| `--space-lg` | 24px | 卡片内边距 |
| `--space-xl` | 28px | 大模块间距 / 页面外边距 |
| `--space-xxl` | 32px | 大区块之间 |

### 2.7 圆角（Border Radius）

| Token | 值 | 语义 |
|-------|----|------|
| `--radius-xs` | 4px | 表单输入框、小标签 |
| `--radius-sm` | 5px | 菜单项、列表行 |
| `--radius-md` | 8px | 操作按钮、工具按钮 |
| `--radius-lg` | 12px | 卡片、功能容器 |
| `--radius-xl` | 16px | 大容器、弹窗 |
| `--radius-full` | 9999px | 胶囊 CTA、圆形图标按钮 |

### 2.8 阴影 / 海拔（Elevation）

**Notion 风格阴影是多层近透明叠加，禁止硬投影。**

| Token | 层数 | 用途 |
|-------|------|------|
| `--shadow-none` | — | 默认：仅 hairline |
| `--shadow-soft` (Level 1) | 4 层 | 悬停卡片、浮动按钮 |
| `--shadow-elevated` (Level 2) | 5 层 | 弹窗、下拉面板 |
| `--shadow-focus` | 单层 | 焦点环 `0 0 0 3px var(--focus-ring-color)` |

### 2.9 尺寸 / 运动

| Token | 值 | 用途 |
|-------|----|------|
| `--control-height-sm` | 32px | 小控件（紧凑表格行） |
| `--control-height-md` | 36px | 默认控件 |
| `--control-height-lg` | 44px | 主按钮、大输入框（≥44px 触达目标） |
| `--content-max-width` | 1280px | 页面最大内容宽度 |
| `--sidebar-width` | 240px | 侧边栏展开宽度 |
| `--header-height` | 64px | 顶部导航高度 |
| `--duration-fast` | 150ms | 微交互 |
| `--duration-base` | 200ms | 常规过渡 |
| `--duration-slow` | 300ms | 页面切换、弹窗入场 |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 统一缓动曲线 |

### 2.10 语义别名（Semantic Aliases）

为减少页面样式迁移成本，额外暴露以下别名：

| 别名 | 指向 |
|------|------|
| `--surface-page` | `var(--color-canvas-soft)` |
| `--surface-panel` | `var(--color-surface)` |
| `--text-primary` | `var(--color-ink)` |
| `--text-secondary` | `var(--color-ink-secondary)` |
| `--text-muted` | `var(--color-ink-muted)` |
| `--text-placeholder` | `var(--color-ink-faint)` |
| `--border-default` | `var(--color-hairline)` |
| `--transition-fast` | `var(--duration-fast) var(--ease-standard)` |
| `--transition-base` | `var(--duration-base) var(--ease-standard)` |

---

## 3. 组件库规范

所有公共组件位于 `src/components/`，样式通过 CSS 变量引用 Token。**禁止组件内部硬编码颜色值**。

### 3.1 按钮 `TechButton`

**源文件**：`src/components/common/TechButton.vue`

#### 变体与语义

| 变体 | CSS | 圆角 | 颜色 | 使用场景 |
|------|-----|------|------|----------|
| 主 CTA | `.tech-btn` 默认 | `--radius-full` | 蓝底白字 | "新增图书"、"保存" |
| 次要 | `.tech-btn--secondary` | `--radius-md` | 白底黑字 + 细线边框 | "取消"、"重置"、"导出" |
| 语义成功 | `.tech-btn--success` | `--radius-md` | 成功色浅底 + 边框 | 极少使用（绿色标签更合适） |
| 语义警告 | `.tech-btn--warning` | `--radius-md` | 警告色浅底 + 边框 | — |
| 语义危险 | `.tech-btn--danger` | `--radius-md` | 红色浅底 + 边框 | "删除" |
| 幽灵 | `.tech-btn--ghost` | `--radius-md` | 同次要 | — |
| 图标按钮 | `.tech-btn--icon` | `--radius-full` | 同主 CTA | 仅图标按钮 |

#### 尺寸

| 尺寸 | CSS | 高度 | 内边距 | 字号 |
|------|-----|------|--------|------|
| 默认 | — | 44px (`--control-height-lg`) | 0 20px | 16px |
| 小 | `.tech-btn--small` | 32px (`--control-height-sm`) | 0 12px | 13px |

#### 交互状态

| 状态 | 主 CTA | 次要按钮 |
|------|--------|----------|
| Default | `--color-primary` 填充 | `--color-surface` + `--border-default` |
| Hover | `--color-primary-active` + `--shadow-soft` | `--color-canvas-soft` 填充 + 边框变深 |
| Active | `--color-primary-active` | 不变 |
| Focus | `--shadow-focus`（3px ring） | 同 |
| Disabled | `opacity: 0.45` | 同 |

#### 使用规范

```vue
<!-- ✅ 正确 -->
<TechButton :icon="Plus" variant="primary">新增图书</TechButton>
<TechButton variant="secondary" @click="handleReset">重置</TechButton>
<TechButton variant="danger" :icon="Delete" size="small">删除</TechButton>

<!-- ❌ 错误：硬编码颜色 -->
<button style="background: #00f3ff; color: black;">自定义</button>
```

### 3.2 卡片 `TechCard`

**源文件**：`src/components/common/TechCard.vue`

| 属性 | 值 |
|------|----|
| 背景 | `--surface-panel`（白色） |
| 边框 | 1px `--border-default` |
| 圆角 | `--radius-lg`（12px） |
| 内边距 | `--space-lg`（24px） |
| 默认阴影 | 无 |
| Hover 阴影 | `--shadow-soft` + 边框变深 |

**已禁用**：四角装饰元素（`.corner-decoration`）已 `display: none`，不要重新启用。

```vue
<TechCard>
  <!-- 搜索表单 / 表格 / 内容块 -->
</TechCard>
```

### 3.3 表单输入

Element Plus 输入框全局通过 `element-overrides.scss` 定制，禁止单页硬覆盖。

#### 文本输入 `el-input`

| 属性 | 值 |
|------|----|
| 背景 | `--surface-control` |
| 边框 | 1px `--border-default`（`box-shadow: inset`） |
| 圆角 | `--radius-xs`（4px）|
| 内边距 | 0 12px，最小高 44px (`--control-height-lg`) |
| 字号 | `--font-size-body-sm`（15px） |
| 文字色 | `--text-primary` |
| 占位符 | `--text-placeholder` |
| Hover | 边框 `--color-ink-faint` |
| Focus | 边框 `--color-primary` + `--shadow-focus` |
| Disabled | `opacity: 0.45` |

#### 下拉选择 `el-select`

同文本输入，展开面板使用 `--surface-panel` + `--shadow-overlay-elevated`。

#### 数字输入 `el-input-number`

同文本输入，步进按钮使用次要按钮样式。

#### 使用规范

```vue
<!-- ✅ 直接使用 Element Plus，全局样式已覆盖 -->
<el-input v-model="keyword" placeholder="搜索..." clearable />
<el-select v-model="category" placeholder="分类">...</el-select>

<!-- ❌ 禁止手动硬写 wrapper 样式（Cyber 时代产物） -->
<!-- <span class="input-border"></span> 已不需要 -->
```

### 3.4 表格

Element Plus 表格全局定制位于 `element-overrides.scss`。

#### 行高与密度

| 密度 | 行高 | 使用场景 |
|------|------|----------|
| 默认（Default） | ~48px | 标准列表页 |
| 紧凑（size="small"） | ~36px | 密集数据 |

#### 表头

| 属性 | 值 |
|------|----|
| 背景 | `--color-canvas-soft` |
| 文字 | `--text-muted` |
| 字号 | `--font-size-eyebrow`（12px） |
| 字重 | 600 |
| 上边距 | 无 |
| 下边距 | 1px `--color-hairline` |

#### 表体

| 属性 | 值 |
|------|----|
| 背景 | `--color-surface`（斑马纹使用 `--color-canvas-soft`） |
| 文字 | `--text-primary` |
| 字号 | `--font-size-body-sm`（15px） |
| 行分隔 | 1px `--color-hairline` |
| Hover 行 | `rgba(0,0,0,0.04)` |

#### 分页

`el-pagination` 使用次要按钮样式，页码文字默认 `--text-muted`，活动页 `--color-primary` + `--color-info-soft` 背景。

#### 已废弃的 Cyber 风格

**以下写法需要清理**（`books/index.vue` 中仍存在）：
- ❌ `var(--tech-neon-cyan)` → ✅ `var(--color-primary)`
- ❌ `var(--tech-font-mono)` → ✅ `var(--font-family-base)`
- ❌ `.title-icon` + 霓虹边框 → ✅ 移除或用 SVG 图标 + `currentColor`
- ❌ `class="custom-table tech-table"` 双前缀 → ✅ 只需 Element Plus 全局覆盖

### 3.5 标签 / 徽章 `el-tag`

| 变体 | 背景 | 边框 | 文字 |
|------|------|------|------|
| 信息（默认） | `--color-info-soft` | `--color-info-border` | `--color-primary` |
| 成功 | `--color-success-soft` | `--color-success-border` | `--color-success` |
| 警告 | `--color-warning-soft` | `--color-warning-border` | `--color-warning` |
| 危险 | `--color-danger-soft` | `--color-danger-border` | `--color-danger` |

圆角 `--radius-full`（胶囊型），内边距 `4px 10px`，字号 `--font-size-eyebrow`（12px）。

**禁止**为装饰性分类（如"文学"、"科技"）使用装饰色（sticker palette）作为标签背景——只有语义状态（成功/失败/警告/信息）使用彩色标签。

### 3.6 弹窗 `el-dialog`

| 属性 | 值 |
|------|----|
| 背景 | `--color-surface` |
| 边框 | 1px `--border-default` |
| 圆角 | `--radius-xl`（16px） |
| 阴影 | `--shadow-overlay-elevated` |
| 遮罩 | `--overlay-scrim`（rgba(0,0,0,0.45)） |
| 最大宽 | 按弹窗类型：form 560px、登录注册 480px |
| 入场动画 | `fade-in` 150ms → 400ms 延迟 |

弹窗头部标题使用 `--font-size-title`（20px），表单标签使用 `--font-size-caption`（14px）。

**已废弃**：Cyber 风格弹窗（霓虹边框、发光阴影、深色背景）。登录页 `.tech-dialog` 的两套样式中，Notion 风格（浅色）已生效，深色 Cyber 样式已禁用。

### 3.7 分页组件

**源文件**：`src/components/Pagination/index.vue`

| 属性 | 值 |
|------|----|
| 信息文字 | `--text-muted`，字号 13px |
| 活动页码 | `--color-primary` 文字 + `--color-info-soft` 背景 + `--radius-sm` |
| 非活动页码 | `--text-muted` + hover 变 `--text-primary` + `--color-canvas-soft` |
| 尺寸选择器 | 同次要按钮 |

### 3.8 状态标签 `StatusTag`

**源文件**：`src/components/common/StatusTag.vue`（如果存在）

用于数据状态展示（如图书库存状态、借阅状态）。

| 状态 | 点色 | 文字色 |
|------|------|--------|
| 有货/可用 | `--color-success` | `--color-success` |
| 缺货 | `--color-danger` | `--color-danger` |
| 借阅中 | `--color-primary` | `--color-primary` |
| 已归还 | `--color-success` | `--color-success` |
| 逾期 | `--color-warning` | `--color-warning` |
| 已预约 | `--color-info` | `--color-info` |

### 3.9 导航菜单 `el-menu`

**源文件**：`src/views/layout/index.vue`

| 属性 | 值 |
|------|----|
| 侧边栏背景 | `--color-canvas` |
| 菜单项 | 无默认背景，`--color-ink-secondary` 文字 |
| Hover | `rgba(0,0,0,0.04)` + `--color-ink` 文字 |
| 活动项 | `--color-info-soft` 背景 + `--color-primary` 文字 + 左侧 3px `inset` 指示条 |
| 分隔线 | 1px `--border-default` |
| 分组标题 | `--color-ink-faint` 文字，`--font-size-eyebrow`（12px），600 字重 |
| 折叠状态 | 保留图标，隐藏文字和分组标题 |

### 3.10 顶部 Header

| 属性 | 值 |
|------|----|
| 高度 | `--header-height`（64px） |
| 背景 | `rgba(255,255,255,0.96)` + `backdrop-filter: blur(12px)` |
| 下边距 | 1px `--border-default` |
| 面包屑 | `--text-muted` + 分隔符 `/` |
| 可折叠按钮 | 36×36px，`--radius-md`，hover `rgba(0,0,0,0.05)` |
| 用户信息区 | hover `rgba(0,0,0,0.04)`，`--radius-md` |
| Avatar | 40px，`--color-primary` 背景白字 |
| 通知徽章 | `--color-danger` 背景 + 白字，18px 直径 |

### 3.11 统计卡片（Stat Card）

**使用场景**：Dashboard/首页的数据概览，展示关键指标数值。

| 属性 | 值 |
|------|----|
| 背景 | `--surface-panel` |
| 边框 | 1px `--border-default` |
| 圆角 | `--radius-lg`（12px） |
| 内边距 | `--space-lg`（24px） |
| 默认阴影 | 无 |
| Hover 阴影 | `--shadow-soft` + 边框变深 |

#### 布局结构

```
┌─────────────────────────────────┐
│  [图标区]  [数值区]     [趋势]   │
│            数值  (大字号)        │
│            标签  (小字号淡色)     │
└─────────────────────────────────┘
```

| 元素 | 样式 |
|------|------|
| 背景图标容器 | 36×36px 圆形 / 圆角方形，装饰色浅底 + 同色系图标 |
| 数值 | 32px，700，`--text-primary` |
| 标签 | 13px，400，`--text-muted`，可全大写 |
| 趋势指示器 | 13px，正数用 `--color-success`，负数用 `--color-danger` |

#### 装饰色映射（仅图标区域，严禁涂满卡片）

| 指标 | 建议色 |
|------|--------|
| 今日借阅 | `--color-primary` |
| 今日归还 | `--color-success` |
| 逾期数 | `--color-warning` |
| 总藏书 | `--color-info` |

**已废弃**：Cyber 风格的渐变顶部装饰条、霓虹发光图标容器。

### 3.12 图表（ECharts / Chart 组件）

**源文件**：`src/components/Chart/index.vue` + `src/utils/echarts-tech-theme.ts`（待迁移）

#### 主题要求（待从 Cyber 迁移）

当前 `echarts-tech-theme.ts` 使用深色背景 + 霓虹色序列，需要迁移为 Notion 风格：

| 元素 | Cyber（当前） | Notion（目标） |
|------|--------------|----------------|
| 背景 | `#050510` 深色渐变 | `transparent`（透传父卡片白色） |
| 主色序列 | 霓虹青蓝/品红/绿/琥珀 | `--color-primary` + sticker palette 克制使用 |
| 文字色 | `#e0e0ff` 浅紫白 | `--color-ink-secondary` `#31302e` |
| 坐标轴 | `rgba(0,243,255,0.2)` 霓虹线 | `--color-hairline` 细线 |
| 标题阴影 | `text-shadowBlur: 10px` | 无 |
| Tooltip | 深色毛玻璃 + 霓虹边 | `--color-surface` + `--border-default` + `--shadow-overlay-elevated` |
| Legend | 浅紫白文字 | `--text-muted` |
| 渐变填充 | 霓虹渐变（高饱和度） | 低饱和浅底（opacity 0.1–0.15） |

#### 容器约束

| 属性 | 值 |
|------|----|
| 卡片 | 必须包裹在 `TechCard` 内 |
| 卡片内边距 | `--space-lg` |
| 图表最小高 | 300px（柱状图）/ 320px（折线图） |
| 图表最大宽 | 整宽（在卡片内） |
| 响应式 | ResizeObserver 监听容器变化自动 resize |

#### 图表卡片标题（待清理）

当前 analytics 页面使用 `.neon-text` + `.title-icon` + `.data-stream` 装饰——这些都是 Cyber 风格残留：

```vue
<!-- ❌ Cyber 风格（待清理） -->
<h3 class="chart-title neon-text">
  <span class="title-icon">▸</span>
  借阅趋势
  <span class="data-stream">▋</span>
</h3>

<!-- ✅ Notion 规范 -->
<h3 class="chart-title">借阅趋势</h3>
```

图表卡片标题使用 `--font-size-title`（20px），600 字重，`--text-primary` 颜色。卡片内边距头部 `--space-md`，底部 `--space-lg`。

### 3.13 洞察卡片 / Insight Item

**使用场景**：analytics 页面的数据洞察区域。

| 元素 | 样式 |
|------|------|
| 图标容器 | 40×40px，`--radius-md`，装饰色浅底（如 `--color-success-soft`），同色系图标 |
| 标签文字 | `--font-size-caption`（14px），`--text-muted` |
| 数值 | 24px，700，`--text-primary` 或语义色 |
| 描述 | 13px，`--text-muted` |
| 布局 | icon + content 横排，gap 16px |
| 网格 | analytics 页面洞察区 3 列 grid，gap 24px |

#### 语义色映射

| 洞察类型 | 建议色 |
|----------|--------|
| 正向增长 | `--color-success` |
| 负向趋势 | `--color-danger` |
| 中性/信息 | `--color-primary` |

**已废弃**：`.insight-icon.trend-up` / `.insight-icon.hot-book` 等使用硬编码霓虹色的类。

### 3.14 页面标题与面包屑

| 元素 | 样式 |
|------|------|
| `.page-title` | `--font-size-heading-2`（26px），700，`--text-primary` |
| `.page-subtitle` | `--font-size-caption`（14px），`--text-muted` |
| `.page-header` | flex，gap 24px，底部 24px margin |

---

## 4. 页面布局规格

### 4.1 App Shell 布局

```
┌──────────────────────────────────────────────────┐
│  Header  64px  │                                  │
│                │                                  │
├──────┐         │                                  │
│      │         │                                  │
│ Side │ Main    │                                  │
│ bar  │ Content │  1280px max centered             │
│ 240px│         │  padding: 24px 28px 32px         │
│      │         │                                  │
└──────┴─────────┴──────────────────────────────────┘
```

| 区域 | 宽度/高度 | 背景 |
|------|-----------|------|
| 侧边栏（展开） | 240px | `--color-canvas` |
| 侧边栏（折叠） | 72px | 同上 |
| 顶部 Header | 64px | 半透明白 + blur |
| 主内容 | `min-height: calc(100vh - 64px)` | `--color-canvas-soft` |
| 内容最大宽 | 1280px | 居中（`margin: 0 auto`） |

### 4.2 登录页（Editorial 双栏）

Notion 风格的登录卡片分为两块：

```
┌─────────────────────┬─────────────────────────┐
│                     │                         │
│   品牌区（左 42%）   │    表单区（右 58%）       │
│                     │                         │
│   · Logo 图标        │    · 欢迎文字            │
│   · 系统标题         │    · 用户名输入          │
│   · 副标题           │    · 密码输入            │
│                     │    · 记住密码 / 忘记密码  │
│   背景:              │    · 登录按钮            │
│   --color-secondary  │    · 注册链接            │
│   (深靛蓝)           │    · 背景: --color-surface │
│   文字白色           │    · 文字深色            │
│                     │                         │
├─────────────────────┴─────────────────────────┤
│              安全信息 底部栏                    │
└───────────────────────────────────────────────┘
```

| 属性 | 值 |
|------|----|
| 卡片总尺寸 | max-width 1040px，min-height 620px |
| 品牌区 | `--color-secondary` 深色填充，Logo 48px 白色卡片 |
| 表单区 | `--color-surface`，内边距 48px 56px |
| 登录按钮 | `--color-primary`，`--radius-md`，44px 高 |
| 输入框 | `--radius-xs`（4px），44px 高 |
| 页面外层 | `--color-canvas-soft` 背景 |
| 响应式 <900px | 比例改为 38:62 |
| 响应式 <768px | 改为纵向堆叠（品牌区在顶部） |

**已废弃**：粒子背景、网格透视、全息投影、扫描线、故障文字（glitch）、霓虹发光按钮——这些 Cyber 效果在 `@media not all` 中已被禁用。

### 4.3 列表页通用布局（图书 / 会员 / 借阅）

```
┌──────────────────────────────────────────┐
│  Page Header                              │
│  · 标题 + 副标题         · 右侧操作按钮    │
├──────────────────────────────────────────┤
│  Search Card (TechCard)                   │
│  [搜索输入] [下拉选择]  [搜索] [重置]     │
├──────────────────────────────────────────┤
│  Table Card (TechCard)                    │
│  ┌────────────────────────────────────┐  │
│  │ 表头区: 标题 + 导出按钮            │  │
│  ├────────────────────────────────────┤  │
│  │ 表格 Body                          │  │
│  ├────────────────────────────────────┤  │
│  │ 分页区: 显示 N-M 共 X 条  | Pagination│  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

| 区块 | 组件 | 间距 |
|------|------|------|
| 搜索卡 | `TechCard` | `margin-bottom: 16px` |
| 表格卡 | `TechCard` | — |
| 表头内部 | flex 两端对齐 | `padding: 20px 28px` |
| 表体 | `el-table` | — |
| 分页区 | flex 两端对齐 | `padding: 16px 28px`，上边框细线 |

### 4.4 首页 Dashboard

| 区块 | 列数 | 间距 |
|------|------|------|
| 统计卡片 | 4 列（响应式：1200px → 2 列，768px → 1 列） | 20px |
| 图表 + 活动（主） | 左 1fr | — |
| 快捷操作 + 热门图书（侧） | 右 360px（1200px → 自动下沉） | 24px gap |

统计卡片：`border-radius: 12px`，`border: 1px solid --border-default`，默认阴影 `none`，hover `--shadow-soft`。

**已废弃**：Cyber 风格的渐变顶部装饰条、霓虹发光图标、扫描线、背景网格——这些已被同名 Notion 样式覆盖。

### 4.5 弹窗（表单）布局

```
┌────────────────────────────────┐
│  [× 关闭]                       │
├────────────────────────────────┤
│  表单标签：输入框               │
│  表单标签：选择器               │
│  表单标签：数字输入             │
│                                │
├────────────────────────────────┤
│         [取消]  [保存]          │
└────────────────────────────────┘
```

| 属性 | 值 |
|------|----|
| 标签宽度 | 90px，右对齐 |
| 标签色 | `--text-primary`，`--font-size-caption`，600 字重 |
| 输入框 | 整行宽度，44px 高 |
| 表单项间距 | 20px |
| 按钮区 | 右对齐，gap 12px |
| 保存按钮 | `TechButton` primary |
| 取消按钮 | `TechButton` secondary |

---

## 5. 交互状态

### 5.1 按钮状态矩阵

| 状态 | Primary | Secondary | Danger |
|------|---------|-----------|--------|
| **Default** | 蓝底白字（#0075de） | 白底黑字 + 1px 边框 | 红软底 + 红边红字 |
| **Hover** | 深蓝 + soft shadow | 浅米底 + 深灰边 | 同上加深边 |
| **Active** | 深蓝（无额外内阴影） | 同上 | 同上 |
| **Focus** | `0 0 0 3px rgba(0,117,222,0.2)` | 同左 | 同左 |
| **Disabled** | `opacity: 0.45`，禁止事件 | 同左 | 同左 |

### 5.2 表格行状态

| 状态 | 效果 |
|------|------|
| Default | 白底（/ 斑马纹浅米） |
| Hover | `rgba(0,0,0,0.04)` 填充 |
| Selected | `--color-info-soft` 背景 |
| Loading | `el-table` loading 遮罩 |

### 5.3 输入框状态

| 状态 | 边框 | 阴影 |
|------|------|------|
| Default | `--border-default` | 无 |
| Hover | `--color-ink-faint` | 无 |
| Focus | `--color-primary` 插入边框 | `--shadow-focus` |
| Error | `--color-danger` 插入边框 | — |
| Disabled | 同 Default + `opacity: 0.45` | — |

### 5.4 菜单项状态

| 状态 | 效果 |
|------|------|
| Default | 透明背景，`--text-secondary` 文字 |
| Hover | `rgba(0,0,0,0.04)` + `--text-primary` |
| Active | `--color-info-soft` 背景 + `--color-primary` 文字 + 左侧 3px 蓝指示条 |

### 5.5 Toast / 消息

| 类型 | 背景 | 文字 | 图标 |
|------|------|------|------|
| Success | `--color-success-soft` | `--color-success` | ✅ |
| Warning | `--color-warning-soft` | `--color-warning` | ⚠️ |
| Error | `--color-danger-soft` | `--color-danger` | ❌ |
| Info | `--color-info-soft` | `--color-primary` | ℹ️ |

圆角 `--radius-lg`，内边距 16px 24px，阴影 `--shadow-soft`。

---

## 6. 可访问性

### 6.1 焦点管理

- 所有可交互元素必须有明确的 focus 视觉信号（`--shadow-focus` 或 `outline`）
- 焦点从页面第一个可聚焦元素开始
- 弹窗打开时焦点移入弹窗，关闭时回到触发器
- 禁止 `outline: none` 不提供替代样式

### 6.2 色彩对比度

| 前景 | 背景 | 最小对比度 | 用途 |
|------|------|-----------|------|
| `--color-ink` (#000) | `--color-canvas-soft` (#f6f5f4) | 21:1 | 主标题（充分合规） |
| `--color-ink-secondary` (#31302e) | `--color-canvas-soft` | 13:1 | 次正文 |
| `--color-ink-muted` (#615d59) | `--color-canvas-soft` | 5.8:1 | 辅助文字（≥ 4.5:1 AA） |
| `--color-primary` (#0075de) | `--color-on-primary` (#fff) | 4.6:1 | CTA 按钮（刚好合规） |
| `--color-primary` | `--color-canvas-soft` | 4.4:1 | 链接（接近 4.5:1，AA-） |

### 6.3 键盘导航

- `Tab` 顺序遵循视觉左 → 右，上 → 下
- `Enter` 触发按钮、链接
- `Space` 切换复选框、切换开关
- `Escape` 关闭弹窗、下拉、Toast
- 侧边栏菜单：`↑↓` 导航、`Enter` 选择

### 6.4 减少动画偏好

全局已有 `@media (prefers-reduced-motion: reduce)` 规则，所有自定义动画类（fade-in、scanline、glitch 等）应遵守此规则。

### 6.5 屏幕阅读器

- 图标按钮必须有 `aria-label`
- 装饰性 SVG 加 `aria-hidden="true"`
- 表单 input 有对应的 `label` / `aria-label`
- 动态内容变化（Toast、状态更新）使用 `aria-live` 区域

---

## 7. 响应式策略

### 7.1 断点定义

| 名称 | 宽度 | 关键变化 |
|------|------|----------|
| Wide | ≥ 1200px | 多列网格完整展开 |
| Desktop | 768 – 1200px | 网格开始塌缩为 2 列或降序 |
| Mobile | < 768px | 侧边栏折叠、单列堆叠、Header 隐藏次要元素 |
| Small Mobile | < 576px | 卡片内边距收紧、Header padding 减小 |

### 7.2 关键断点变化

| 组件 | ≥ 768px | < 768px | < 576px |
|------|---------|---------|---------|
| 侧栏 | 展开 240px | 自动折叠 72px | 折叠 |
| Page padding | 28px → 32px | 16px | 12px |
| 统计卡片 | 4 列 / 2 列 | 1 列 | 1 列 |
| 登录卡片 | 双栏 | 双栏比例缩小 | 纵向堆叠 |
| Header 时间显示 | 显示 | 隐藏 | 隐藏 |
| Header Breadcrumb | 显示 | 隐藏 | 隐藏 |
| 搜索表单 | flex 横排 | flex-wrap 堆叠 | 全宽堆叠 |

### 7.3 触控目标

所有可点击元素最小 **44×44px**（`--control-height-lg`）。按钮、输入框、菜单项均已满足。图标按钮宽度不足时（如按钮 36px），点击区域通过 `padding` 补足到 44px。

---

## 8. 动画与过渡

### 8.1 过渡时长

| Token | 值 | 用途 |
|-------|----|------|
| `--duration-fast` | 150ms | hover 颜色、微交互 |
| `--duration-base` | 200ms | 组件展开/折叠 |
| `--duration-slow` | 300ms | 页面切换、弹窗入场 |

### 8.2 缓动曲线

统一使用 `cubic-bezier(0.2, 0, 0, 1)`（ease-out-quad 风格）。

### 8.3 预定义动画类

全局 `index.scss` 提供：

| 类名 | 效果 | 时长 |
|------|------|------|
| `.fade-in` | 透明度 0→1 | 300ms |
| `.fade-in-up` | 上移 8px + 透明度 | 300ms |
| `.fade-in-down` | 下移 8px + 透明度 | 300ms |
| `.page-container` / `.tech-page` | 页面容器基础样式 | — |

### 8.4 页面切换

`tech-page-transition`：

```css
&-enter-active, &-leave-active {
  transition: opacity var(--duration-fast);
}
&-enter-from, &-leave-to {
  opacity: 0;
  transform: none;
}
```

**已废弃**：blur 滤镜 + 大幅位移的 Cyber 风格页面切换效果（`filter: blur(4px)`）。

---

## 9. 迁移说明：Cyber → Notion

本节面向正在进行的风格统一工作。

### 9.1 Cyber 风格元素清单（待清理）

| 元素 | 出现位置 | 清理方式 |
|------|----------|----------|
| 扫描线 `scanline-effect` | layout、home、login | 已 `display: none` 覆盖，可移除 DOM |
| 网格背景 `tech-grid-bg` | layout、home、login | 同上 |
| 粒子背景 `.particle-bg` | login | 同上 |
| 全息投影 `.hologram-effect` | login | 同上 |
| 霓虹发光 `box-shadow: 0 0 Xpx #00f3ff` | layout、home、login、books | 改为 `--shadow-soft` / 移除 |
| 故障文字 `.glitch-text` | layout、home | CSS 已 display:none 覆盖，可移除 |
| 霓虹渐变按钮 | layout、home、login | 改为 `TechButton` Notion 规范 |
| 深色全局背景 `#050510` → `#101025` | layout | 改为 `var(--surface-page)` |
| `--tech-*` CSS 变量别名 | design-tokens.scss 底部 | 标记 deprecated，逐步移除 |
| `.corner-decoration` 四角装饰 | TechCard | 已 `display: none` |
| ECharts 霓虹主题 | `echarts-tech-theme.ts` | 重写为 Notion 浅色主题 |
| `.neon-text` / `.data-stream` / `.title-icon` | analytics、books | 移除装饰字符，改为纯文字标题 |
| `.insight-icon` 硬编码霓虹色 | analytics | 替换为 Token 语义色 |
| Cyber 风格 `<style>` block | 全部 13 个视图 | 合并为单一 Notion-only block |

### 9.2 常见迁移模式

#### 模式 1：硬编码颜色 → Token

```scss
// ❌ Cyber 时代
color: #00f3ff;
background: linear-gradient(135deg, #00f3ff, #00c8d4);
box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);

// ✅ Notion 规范
color: var(--color-primary);
background: var(--color-primary);
box-shadow: var(--shadow-soft);
```

#### 模式 2：深色背景 → 浅色页面

```scss
// ❌ Cyber 时代
background: linear-gradient(180deg, #050510 0%, #101025 100%);

// ✅ Notion 规范
background: var(--surface-page);
```

#### 模式 3：双 style block 清理

当前多数页面有两个 `<style lang="scss" scoped>` block，第一个是 Cyber 风格（被 `@media not all` 或第二个 block 覆盖）。清理步骤：

1. 检查第一个 block 是否被 `@media not all` 包裹
2. 若未被包裹且两个 block 冲突，将 Notion 规范保留、Cyber 删除
3. 若有继承关系（Cyber 提供基础、Notion 覆盖），合并为一个 Notion-only block

#### 模式 4：装饰边框 → Element Plus 全局覆盖

```vue
<!-- ❌ Cyber 时代：手动创建装饰边框 -->
<div class="tech-input-wrapper">
  <el-input v-model="keyword" />
  <span class="input-border"></span>  <!-- 多余元素 -->
</div>

<!-- ✅ Notion 规范：直接用 Element Plus -->
<el-input v-model="keyword" />
```

### 9.3 `--tech-*` 变量标记

`design-tokens.scss` 第 180-243 行暴露了大量 `--tech-*` 别名（如 `--tech-primary`、`--tech-neon-cyan`、`--tech-font-cyber`）。这些是迁移期兼容层，**新代码禁止使用**。

### 9.4 待审查文件

**全部 13 个视图文件 + 2 个工具文件存在 Cyber 残留样式**，建议按以下优先级审查：

| 优先级 | 文件 | 关键问题 |
|--------|------|----------|
| P0 | `utils/echarts-tech-theme.ts` | 整个文件需要重写为 Notion 浅色主题 |
| P0 | `views/layout/index.vue` | 双重 style block，最长文件（1479 行） |
| P0 | `views/home/index.vue` | Cyber 样式未完全隔离 |
| P1 | `views/analytics/index.vue` | `.neon-text` / `.data-stream` / `.insight-icon` |
| P1 | `views/books/index.vue` | 仍引用 `--tech-*` 变量 |
| P1 | `views/login/index.vue` | 双重 style block（Notion 已生效，Cyber 被禁用） |
| P2 | `views/borrow/index.vue` | Cyber 残留 |
| P2 | `views/members/index.vue` | Cyber 残留 |
| P2 | `views/reports/index.vue` | Cyber 残留 |
| P2 | `views/reservations/index.vue` | Cyber 残留 |
| P2 | `views/profile/index.vue` | Cyber 残留 |
| P2 | `views/profile/EditProfileForm.vue` | Cyber 残留 |
| P2 | `views/settings/index.vue` | Cyber 残留 |
| P2 | `views/books/detail.vue` | Cyber 残留 |
| — | `components/common/TechButton.vue` | ✅ 已清理，推荐作为参考模板 |
| — | `components/common/TechCard.vue` | ✅ 已清理 |

---

## 10. 附录：Do's and Don'ts

### Do ✅

- 只让 `--color-primary` 承担 CTA、链接、焦点三个角色
- 页面底色用 `--color-canvas-soft`，卡片用 `--color-surface`
- 卡片只给 hairline 边框，不要重阴影
- CTA 用全胶囊 `--radius-full`，操作按钮用 `--radius-md`，输入框用 `--radius-xs`
- 装饰色（sticker palette）只用于插画和装饰性标签
- 新增样式一律引用 Token，禁止硬编码颜色值
- 让留白成为模块间的主分组手段
- 页面切换用 opacity 过渡，不要 blur + 位移
- 表单标签 + 输入框之间留 `--space-xs` 间距
- 确保所有焦点元素清晰可见

### Don't ❌

- 不要画 CTA 或结构容器为装饰色（紫/粉/橙/青/绿）
- 不要同时使用两个结构性强调色
- 不要给输入框用全胶囊圆角（保持 `--radius-xs` 方角感）
- 不要用硬投影阴影（多层柔和叠加才是 Notion 风格）
- 不要引入 Cyber 风格特效（扫描线、霓虹发光、故障文字、网格背景）
- 不要在新代码中引用 `--tech-*` 变量别名
- 不要用等宽字体（`var(--font-family-base)` 统一即可）
- 不要在页面上画发光边框（`box-shadow: 0 0 Xpx` 已废弃）
- 不要让 Body 文字用 700 重字重（保持 400，让 700 专属标题）
- 不要跳过 `prefers-reduced-motion` 检查

---

> **文档维护说明**：本规范与 `DESIGN.md`、`_notion-values.scss`、`design-tokens.scss` 形成一套完整链路。修改 Token 必须同步更新三处文档，修改组件样式必须先检查本文档的约束。
