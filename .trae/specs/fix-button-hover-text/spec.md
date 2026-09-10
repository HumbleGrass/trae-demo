# 修复按钮 hover 状态文字不可见问题 + 重新设计列表操作按钮

## Why
用户反馈两个问题：
1. 页面中所有主色调按钮在 hover 状态下文字不可见
2. 所有列表中的操作按钮需要重新设计，不一定非要使用传统按钮形式

需要修复文字颜色对比度问题，并探索更轻量的操作按钮设计方案。

## What Changes
- 修复主按钮 `.el-button--primary` 在所有状态下的文字颜色
- 确保 hover 状态文字对比度 ≥4.5:1（WCAG AA 级标准）
- 统一全项目按钮 hover、active、disabled 状态样式
- 使用明确的白色 `#ffffff` 文字，配合 `!important` 确保样式优先级
- **新增**：重新设计列表操作按钮，探索非按钮形式的轻量设计
- **新增**：支持操作按钮使用图标、文字链接等多种形式

## Impact
- 影响范围：全项目所有使用 Element Plus 主按钮的页面
- 修改文件：
  - `frontend/src/styles/index.scss` - 全局按钮样式
  - `frontend/src/views/books/index.vue` - 图书管理页面按钮
  - `frontend/src/views/login/index.vue` - 登录页面按钮
  - `frontend/src/components/SearchForm/index.vue` - 搜索组件按钮
  - `frontend/src/components/common/BaseTable.vue` - 表格操作按钮组件

## ADDED Requirements

### Requirement: 主按钮文字可见性
系统中的所有主色调按钮在任何状态下文字都必须清晰可见。

#### Scenario: 按钮默认状态
- **WHEN** 用户查看主按钮
- **THEN** 按钮文字为纯白色 `#ffffff`，与棕色背景对比度 ≥4.5:1

#### Scenario: 按钮悬停状态
- **WHEN** 用户鼠标悬停在主按钮上
- **THEN** 按钮文字保持纯白色 `#ffffff`，悬停后背景对比度 ≥4.5:1

#### Scenario: 按钮激活状态
- **WHEN** 用户点击主按钮（active 状态）
- **THEN** 按钮文字保持纯白色 `#ffffff`

#### Scenario: 按钮禁用状态
- **WHEN** 主按钮处于禁用状态
- **THEN** 按钮文字为浅灰色，背景为浅灰色，明确表示不可交互

### Requirement: 列表操作按钮重新设计
列表中的操作按钮不一定非要使用传统按钮形式，应该探索更轻量、更优雅的设计。

#### Scenario: 图书列表操作按钮
- **WHEN** 用户查看图书列表中的操作列
- **THEN** 操作按钮可以使用以下形式之一：
  - 纯图标按钮（带 tooltip 提示）
  - 文字链接样式（下划线悬停效果）
  - 图标+文字的轻量组合
  - 极简按钮样式（无边框、无背景）

#### Scenario: 操作按钮交互反馈
- **WHEN** 用户悬停在操作按钮上
- **THEN** 有明确的视觉反馈（颜色变化、下划线、图标动画等）

#### Scenario: 主要操作突出
- **WHEN** 列表中有主要操作（如"编辑"）和次要操作（如"删除"）
- **THEN** 主要操作在视觉上有轻微突出，次要操作保持轻量
