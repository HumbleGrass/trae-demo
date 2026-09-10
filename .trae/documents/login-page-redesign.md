# 登录页面重新设计计划

## 概述

将登录页面从当前的赛博朋克风格（含大量残留代码）彻底重构为 Notion 风格的简洁设计：纯居中单列卡片 + 暖白全屏背景，移除所有赛博朋克特效。

## 当前状态分析

文件：`frontend/src/views/login/index.vue`（约 1787 行）

### 问题
1. **两套样式共存**：第一个 `<style>` 块（L435-L1233）包裹在 `@media not all` 中（已失效的赛博朋克样式），第二个 `<style>` 块（L1236-L1787）是 Notion 风格样式
2. **模板残留**：模板中仍有赛博朋克元素引用（`particle-bg`、`tech-grid-bg`、`hologram-effect`、`scanline-effect`、`logo-ring`、`logo-pulse`、`btn-glow` 等）
3. **布局不符**：当前使用 `login-card--editorial` 左右分栏布局，需改为纯居中单列
4. **脚本残留**：`createParticles()`、`startTyping()`、`particleRef` 等赛博朋克相关逻辑

### 保留不变
- 所有 `<script setup>` 中的业务逻辑（`handleLogin`、`handleRegister`、表单验证、路由跳转等）
- 注册弹窗和忘记密码弹窗的功能
- Element Plus 组件用法
- API 调用和 Store 交互

## 设计方案

### 布局
- 全屏 `canvas-soft`（#f6f5f4）暖白背景
- 登录卡片水平垂直居中，最大宽度 420px
- 卡片内单列垂直排列：Logo → 标题 → 表单 → 按钮 → 注册链接
- 底部 footer 信息放在卡片外底部

### 视觉风格（遵循 DESIGN.md Notion 规范）
- 卡片：白色 `surface`，`border-radius: var(--radius-xl)` (16px)，`border: 1px solid var(--border-default)`，`box-shadow: var(--shadow-elevated)`
- 标题：`font-size: var(--font-size-heading-2)` (26px)，`font-weight: 700`
- 副标题：`font-size: var(--font-size-body-sm)` (15px)，`color: var(--text-muted)`
- 输入框：`border-radius: var(--radius-xs)` (4px)，`border: 1px solid var(--border-default)`
- 登录按钮：`border-radius: var(--radius-md)` (8px)，Notion 蓝 `var(--color-primary)`
- 移除所有渐变、霓虹、发光、粒子、扫描线效果

### 移除的元素
- 粒子背景 (`particle-bg`, `particleRef`, `createParticles()`)
- 网格背景 (`tech-grid-bg`)
- 全息投影 (`hologram-effect`)
- 扫描线 (`scanline-effect`)
- Logo 光环 (`logo-ring`, `logo-pulse`)
- 打字机效果 (`typingText`, `startTyping()`, `blink-cursor`)
- 按钮光效 (`btn-glow`)
- 整个第一个 `<style>` 块（`@media not all` 包裹的失效样式）

## 实施步骤

### 步骤 1：清理模板

修改 `frontend/src/views/login/index.vue` 的 `<template>` 部分：

- 移除 `particle-bg`、`tech-grid-bg`、`hologram-effect`、`scanline-effect` 四个装饰 div
- 移除 `login-card--editorial` class，改为简洁的 `login-card`
- 简化 `card-header`：移除 logo-ring、logo-pulse，保留 logo-icon 和标题
- 移除 `welcome-text`（打字机区域）
- 简化 `login-button`：移除 `btn-glow`，简化 `btn-content`
- 移除 `card-footer` 中的安全连接装饰（或改为简洁文字）

### 步骤 2：清理脚本

- 移除 `particleRef` ref
- 移除 `typingText`、`fullText`、`typingIndex`、`typingInterval` 变量
- 移除 `createParticles()` 函数
- 移除 `startTyping()` 函数
- 简化 `onMounted`：移除 `nextTick` 中的 `createParticles()` 和 `startTyping()` 调用
- 简化 `onUnmounted`：移除 `typingInterval` 清理

### 步骤 3：重写样式

- 删除整个第一个 `<style>` 块（L435-L1233，`@media not all` 包裹的部分）
- 重写第二个 `<style>` 块：
  - `.tech-login-container`：全屏居中，`background: var(--color-canvas-soft)`
  - `.login-card`：`max-width: 420px`，`width: 100%`，白色背景，圆角 16px，柔和阴影
  - `.card-header`：居中布局，不再使用 grid-area
  - `.card-body`：单列表单布局
  - `.login-button`：使用 Notion 蓝，圆角 8px
  - 弹窗样式：使用 Notion 设计规范
  - 保留响应式断点适配

### 步骤 4：验证

- 在浏览器中打开 http://localhost:5174/login 检查视觉效果
- 测试登录表单功能（输入、验证、提交）
- 测试注册弹窗和忘记密码弹窗
- 检查移动端响应式布局

## 假设与决策

- 保留 SVG logo 图标，但移除赛博朋克渐变着色，改用 Notion 风格简洁着色
- 保留"记住密码"和"忘记密码"功能
- 保留注册弹窗和忘记密码弹窗，样式统一为 Notion 风格
- 卡片底部 footer 保留安全提示文字，但简化样式
