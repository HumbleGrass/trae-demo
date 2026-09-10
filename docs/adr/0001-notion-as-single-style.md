# ADR-0001: Notion 风格作为唯一设计语言，弃用 Cyber/Tech 风格

**状态**: Accepted  
**日期**: 2026-09-10  
**决策者**: 前端团队

## 背景

项目经历了从「Cyber/Tech 赛博朋克风格」到「Notion 温暖纸质风格」的视觉迁移。当前处于**双风格并存**的过渡状态：

- CSS 变量层同时暴露 `--color-primary`（Notion 原语）和 `--tech-*`（Cyber 兼容别名）
- 多个页面有双重 `<style>` block（Cyber 在前，Notion 在后覆盖）
- Cyber 风格特效（扫描线、霓虹发光、故障文字、粒子背景、网格背景）部分通过 `@media not all` trick 禁用，部分未完全隔离
- ECharts 主题文件 `echarts-tech-theme.ts` 仍是深色霓虹配色

## 决策

**1. Notion 风格为唯一目标形态**

- Token 源头：`_notion-values.scss` → `design-tokens.scss`（CSS 变量）
- 设计原则：遵循根目录 `DESIGN.md` 中的 8 条原则（单一强调色、装饰色只装饰、纸一样的背景、细线定义边界、字重即表达力、留白为主分组手段等）
- 所有 `--tech-*` 变量别名标记 deprecated，不再在新代码中使用

**2. Cyber 风格元素全部清理**

| 类别 | 元素 | 处置 |
|------|------|------|
| 视觉特效 | 扫描线、粒子、全息投影、网格背景、霓虹发光、故障文字 | DOM 移除或 CSS 永久 `display: none` |
| 颜色 | 硬编码 `#00f3ff`、`#ff33ff`、`#00ff88` 等霓虹色 | 替换为 Token 引用 |
| 字体 | `mono`、`cyber`、硬编码 `text-shadow: 0 0 Xpx` | 统一 `--font-family-base`，无发光 |
| 阴影 | `box-shadow: 0 0 Xpx` 霓虹发光 | 替换为 `--shadow-soft` / `--shadow-elevated` |
| 背景 | 深色 `linear-gradient(#050510 → #101025)` | 替换为 `var(--surface-page)` |
| 动画 | Cyber 风格 `filter: blur(4px)` 页面切换、大幅位移 | 替换为 opacity-only 淡入 |

**3. 视觉系统的核心约束不可违反**

- 只有 `#0075de` (Notion Blue) 是结构性强调色——CTA、链接、焦点信号
- 装饰色（sticker palette：紫/粉/橙/青/绿/天蓝）只用于图标、分类圆点、封面插画块
- CTA 圆角 = 9999px（胶囊），操作按钮圆角 = 8px，输入框圆角 = 4px（方角感）
- 不依赖阴影分层，只用 hairline 边框定义容器边界
- 标题 700 + 正文 400 的对比是主要表达力手段

**4. Element Plus 通过 SCSS 变量覆盖定制，禁止 `!important` 全局覆盖**

在 `element-overrides.scss` 和 `element-adjustments.scss` 中通过编译时变量定制组件主题，页面级样式只引用 Token。

## 后果

### 正面
- 统一的视觉语言，减少样式维护成本
- 组件复用性提升（不再需要区分 Cyber 版 vs Notion 版）
- 品牌一致性增强，符合 `DESIGN.md` 定义的产品调性
- 新开发者上手只需理解一套 Token 系统

### 代价
- 需要清理约 13 个视图文件中的 Cyber 残留样式
- ECharts 主题需要从深色霓虹迁移到浅色 Notion 风格（这是最大的工作量）
- 历史页面的双 style block 需要合并为单一 Notion-only block
- 部分现有组件（如 `Chart`）的 props API 可能需要增加主题参数

## 关联

- 详细规范见 [`docs/ui-design-system.md`](../ui-design-system.md)
- 术语表见 [`docs/ui-glossary.md`](../ui-glossary.md)
- 视觉分析源头 [`DESIGN.md`](../../DESIGN.md)
- Token 源头 [`_notion-values.scss`](../frontend/src/styles/_notion-values.scss)
