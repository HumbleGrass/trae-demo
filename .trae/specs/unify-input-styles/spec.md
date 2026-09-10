# 输入框样式统一 Spec

## Why
项目中不同页面的输入框大小不一致，登录页面使用 `size="large"` 和较大的 padding，而其他页面使用默认大小，导致视觉不统一。

## What Changes
- 在全局样式中定义统一的输入框尺寸规范
- 移除登录页面的 `size="large"` 属性
- 统一所有输入框的 padding、字体大小、边框样式

## Impact
- Affected code: 
  - `frontend/src/styles/index.scss` (需重建)
  - `frontend/src/views/login/index.vue`
  - 所有使用 `el-input` 的页面

## ADDED Requirements

### Requirement: 统一输入框尺寸
系统 SHALL 为所有 Element Plus 输入框组件提供统一的样式规范。

#### Scenario: 输入框尺寸统一
- **WHEN** 用户访问任意页面
- **THEN** 所有输入框应具有一致的高度(40px)、内边距(10px 14px)和字体大小(14px)

#### Scenario: 登录页面输入框
- **WHEN** 用户访问登录页面
- **THEN** 输入框样式应与其他页面保持一致，不使用 `size="large"`

### Requirement: 全局样式定义
系统 SHALL 在全局样式文件中定义 Element Plus 组件的统一样式。

#### Scenario: 样式覆盖
- **WHEN** 应用加载全局样式
- **THEN** Element Plus 默认样式应被项目自定义样式覆盖
