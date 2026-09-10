# UI 设计系统术语表

| 术语 | 英文 | 定义 |
|------|------|------|
| **设计 Token** | Design Token | 可复用的设计属性原子（颜色、间距、字号等），以 SCSS 变量 / CSS 自定义属性暴露，是样式系统的源头 |
| **Notion Blue** | — | 本系统唯一的结构性强调色 `#0075de`，用于 CTA、链接、焦点信号 |
| **Notion 风格** | Notion-style | 温暖纸面背景 + 安静克制配色的视觉语言，定义于根目录 `DESIGN.md` |
| **Cyber/Tech 风格** | Cyberpunk/Tech-style | 迁移前的深色霓虹风格，已废弃 |
| **Sticker Palette** | — | 多色装饰调色板（紫/粉/橙/青/绿/天蓝），只用于插画和装饰性标签，**严禁**作为 CTA 或容器背景 |
| **Hairline** | — | 1px 细线边框，颜色 `#e6e6e6`，是 Notion 风格定义容器边界的核心手段 |
| **Figure/Ground** | — | 图/地关系——卡片用纯白 `#ffffff`（图），页面用米白 `#f6f5f4`（地） |
| **胶囊按钮** | Pill Button | `border-radius: 9999px` 的全圆角按钮，用于主 CTA |
| **信息架构** | IA (Information Architecture) | 页面/模块的结构组织，导航层级 |
| **触觉目标** | Touch Target | 移动端可点击元素的最小点击区域（44×44px） |
| **层级** | Hierarchy | 通过字号/字重/颜色/间距建立的视觉主次关系 |
| **语义化颜色** | Semantic Colors | 表达状态意义的颜色：成功（绿）、警告（黄）、错误（红）、信息（蓝） |
| **Elevation** | — | 阴影分层，Notion 风格只有 0（hairline）、1（soft）、2（elevated）三层 |
| **组件库** | Component Library | 项目中可复用的 UI 组件集合（TechButton、TechCard、BaseTable 等） |
| **Element Plus** | — | 项目使用的 Vue 3 UI 组件库，通过 SCSS 变量覆盖定制主题 |
| **ADR** | Architecture Decision Record | 架构/设计决策记录，说明为什么做这个决策、有什么后果 |
| **Glyph** | — | 图标中的线条/路径单元，Notion 风格图标使用 1.5–2px 粗线条 |
| **Page Transition** | — | 页面切换时的过渡动画，Notion 风格使用 opacity-only |
| **Backdrop Blur** | — | `backdrop-filter: blur(Xpx)` 半透明模糊效果，用于 Header 和 Modal |
| **Sidebar Collapse** | — | 侧边栏从 240px 展开态到 72px 折叠态的切换 |
| **Responsive Breakpoint** | — | 响应式断点：1200px / 768px / 576px |
| **Focus Ring** | — | 元素获得焦点时的视觉指示环，`0 0 0 3px rgba(0,117,222,0.2)` |
| **Sticky Header** | — | 固定在视口顶部的导航栏 |
| **Zebra Striping** | — | 表格行斑马纹（Notion 风格使用 `--color-canvas-soft`） |
| **OpenType Features** | — | `font-feature-settings` 的子特性，`lnum` 等宽数字、`locl` 本地化字形 |
| **prefers-reduced-motion** | — | 用户系统设置的"减少动画"偏好，所有动画应遵守此媒体查询 |
