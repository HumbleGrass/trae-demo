# 变更记录

本文档记录图书馆管理系统文档的所有变更历史。

---

## [v1.0.0] - 2025-03-27

### Added

- 创建产品规格说明书 SPEC.md
  - 添加产品概述、功能需求、非功能需求
  - 添加业务规则和术语表
  - 添加需求优先级和验收标准

- 创建任务清单 TASKS.md
  - 按 Phase 1-4 里程碑组织
  - 添加任务属性（优先级、工时、状态）
  - 添加 Mermaid 依赖关系图
  - 添加进度统计

- 创建验收检查清单 CHECKLIST.md
  - 按需求模块组织
  - 添加优先级分级
  - 添加验收标准和追溯性

- 创建架构文档目录 architecture/
  - system-architecture.md - 系统架构设计
  - database-design.md - 数据库设计
  - api-specification.md - API 详细规范

- 创建开发规范目录 standards/
  - coding-standards.md - 编码规范（含代码示例）
  - git-workflow.md - Git 工作流规范
  - testing-standards.md - 测试规范

### Changed

- 重构文档结构，将原来 12 个文件整合为 3 个核心文件 + 6 个子文档
- 移除重复内容，明确各文档职责
- 添加版本信息和变更记录

### Removed

- 删除旧的 spec.md、tasks.md、checklist.md
- 删除 system-test-*.md 系列文件
- 删除 fix-test-issues-*.md 系列文件
- 删除 login-register-*.md 系列文件

---

## 文档版本对照

| 旧文件 | 新文件 | 说明 |
|--------|--------|------|
| spec.md | SPEC.md | 精简为核心需求文档 |
| tasks.md | TASKS.md | 按里程碑重组 |
| checklist.md | CHECKLIST.md | 按需求模块重组 |
| system-test-spec.md | (已整合) | 移至 TASKS.md Phase 4 |
| system-test-tasks.md | (已整合) | 移至 TASKS.md Phase 4 |
| system-test-checklist.md | (已整合) | 移至 CHECKLIST.md |
| fix-test-issues-spec.md | (已整合) | 移至 TASKS.md Phase 4 |
| fix-test-issues-tasks.md | (已整合) | 移至 TASKS.md Phase 4 |
| fix-test-issues-checklist.md | (已整合) | 移至 CHECKLIST.md |
| login-register-spec.md | (已整合) | 移至 SPEC.md REQ-002 |
| login-register-tasks.md | (已整合) | 移至 TASKS.md TASK-016 |
| login-register-checklist.md | (已整合) | 移至 CHECKLIST.md |

---

## 后续维护指南

### 更新规范

1. 修改 SPEC.md 时，同步更新相关 TASKS.md 任务
2. 完成任务后，更新 CHECKLIST.md 验收状态
3. 所有变更记录到 CHANGELOG.md

### 版本号规则

- **MAJOR**: 重大架构变更或需求重构
- **MINOR**: 新增功能或需求变更
- **PATCH**: 问题修复或文档修正

### 文档职责

| 文档 | 职责 | 更新时机 |
|------|------|----------|
| SPEC.md | 产品需求定义 | 需求变更时 |
| TASKS.md | 开发任务管理 | 任务状态变更时 |
| CHECKLIST.md | 验收检查 | 功能验收时 |
| architecture/ | 技术架构 | 架构变更时 |
| standards/ | 开发规范 | 规范调整时 |
| CHANGELOG.md | 变更记录 | 每次变更时 |
