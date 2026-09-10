# Checklist for Fixing Button Hover Text Visibility + Action Button Redesign

## Part 1: 主按钮文字可见性修复
- [x] `.el-button--primary` 默认状态文字颜色为 `#ffffff !important`
- [x] `.el-button--primary` hover 状态文字颜色保持 `#ffffff !important`
- [x] `.el-button--primary` active 状态文字颜色保持 `#ffffff !important`
- [x] `.el-button--primary` disabled 状态文字为浅灰色
- [x] 主按钮背景使用新的色阶变量（`--color-primary-600` → `--color-primary-700`）
- [x] Hover 背景使用稍亮色阶（`--color-primary-500` → `--color-primary-600`）
- [x] 所有按钮样式使用 `!important` 确保优先级
- [x] 图书管理页面 `.add-btn` 默认状态文字颜色为白色
- [x] 图书管理页面 `.add-btn` hover 状态文字颜色保持白色
- [x] 图书管理页面 `.search-btn` 默认状态文字颜色为白色
- [x] 图书管理页面 `.search-btn` hover 状态文字颜色保持白色
- [x] 登录页面 `.submit-button` 默认状态文字颜色为白色
- [x] 登录页面 `.submit-button` hover 状态文字颜色保持白色
- [x] 登录页面 `.submit-button` active 状态文字颜色保持白色
- [x] SearchForm 中主按钮所有状态文字颜色为白色

## Part 2: 列表操作按钮重新设计
- [x] 在全局样式中添加 `.icon-action-btn` 样式（纯图标按钮）
  - [x] 图标按钮有合适的内边距和点击区域（≥44x44px）
  - [x] 图标按钮 hover 有明确的视觉反馈
  - [x] 图标按钮配合 tooltip 提示文字
- [x] 在全局样式中添加 `.link-action-btn` 样式（文字链接样式）
  - [x] 链接样式无背景、无边框
  - [x] hover 时有下划线动画
  - [x] 文字颜色使用主色调
- [x] 在全局样式中添加 `.minimal-action-btn` 样式（极简按钮）
  - [x] 极简按钮有轻微边框或背景色
  - [x] hover 时样式变化柔和
- [x] 图书管理页面操作按钮已更新
  - [x] "编辑"按钮使用主要操作样式
  - [x] "删除"按钮使用次要操作样式
  - [x] 操作按钮间距和对齐统一
- [x] BaseTable 通用表格组件操作按钮已更新
  - [x] 支持多种操作按钮样式配置
  - [x] 支持主要/次要操作区分
- [x] 操作按钮交互反馈
  - [x] hover 有明确的视觉反馈
  - [x] active 有按下效果
  - [x] 禁用状态有明ee确标识

## Part 3: 可访问性与验证
- [x] 主按钮默认状态对比度 ≥4.5:1
- [x] 主按钮 hover 状态对比度 ≥4.5:1
- [x] 所有文字在任何状态下都清晰可见
- [x] 禁用状态有明确的视觉反馈
- [x] 按钮最小点击区域 ≥44x44px
- [x] 全页面视觉走查完成
- [x] 所有交互反馈流畅自然