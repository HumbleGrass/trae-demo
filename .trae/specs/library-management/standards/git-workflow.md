# Git 工作流规范

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | v1.0.0 |
| 更新日期 | 2025-03-27 |
| 作者 | Trae |

---

## 一、分支策略

### 1.1 分支类型

| 分支类型 | 命名规则 | 说明 | 生命周期 |
|----------|----------|------|----------|
| main | main | 生产分支，始终稳定可部署 | 永久 |
| develop | develop | 开发分支，集成最新功能 | 永久 |
| feature | feature/xxx | 功能开发分支 | 临时 |
| bugfix | bugfix/xxx | Bug 修复分支 | 临时 |
| hotfix | hotfix/xxx | 紧急修复分支 | 临时 |
| release | release/vX.X.X | 发布分支 | 临时 |

### 1.2 分支命名规范

```
feature/REQ-001-user-login       # 功能：用户登录
feature/REQ-002-book-management  # 功能：书籍管理
bugfix/BUG-001-login-error       # Bug修复：登录错误
hotfix/BUG-002-security-fix      # 紧急修复：安全问题
release/v1.0.0                   # 发布：v1.0.0
```

### 1.3 分支流程图

```
                    ┌─────────────────────────────────────┐
                    │              main                    │
                    │  (生产环境，只接受 merge request)     │
                    └──────────────┬──────────────────────┘
                                   │
                                   │ merge (PR)
                    ┌──────────────▼──────────────────────┐
                    │            release/v1.0.0            │
                    │        (发布分支，测试验证)           │
                    └──────────────┬──────────────────────┘
                                   │
                                   │ merge
                    ┌──────────────▼──────────────────────┐
                    │             develop                  │
                    │    (开发环境，集成所有功能)           │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
   ┌──────────▼──────────┐ ┌───────▼───────┐ ┌────────▼────────┐
   │ feature/REQ-001     │ │ feature/REQ-002│ │ bugfix/BUG-001  │
   │   (用户登录)         │ │  (书籍管理)    │ │  (登录错误)      │
   └─────────────────────┘ └───────────────┘ └─────────────────┘
```

---

## 二、Commit 规范

### 2.1 Commit 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | feat(auth): 添加用户登录功能 |
| fix | Bug 修复 | fix(books): 修复书籍搜索分页问题 |
| docs | 文档更新 | docs: 更新 API 文档 |
| style | 代码格式（不影响功能） | style: 格式化代码缩进 |
| refactor | 重构（不是新功能也不是修复） | refactor(auth): 重构认证逻辑 |
| perf | 性能优化 | perf(books): 优化书籍查询性能 |
| test | 测试相关 | test(auth): 添加登录单元测试 |
| chore | 构建工具、依赖更新 | chore: 更新依赖版本 |
| revert | 回滚提交 | revert: 回滚登录功能 |

### 2.3 Scope 范围

| Scope | 说明 |
|-------|------|
| auth | 认证模块 |
| books | 书籍模块 |
| members | 会员模块 |
| borrow | 借阅模块 |
| reservations | 预约模块 |
| fines | 费用模块 |
| reports | 报表模块 |
| analytics | 分析模块 |
| ui | 前端界面 |
| api | API 接口 |
| db | 数据库 |

### 2.4 Commit 示例

#### 功能开发

```
feat(auth): 添加用户登录功能

- 实现用户名密码登录
- 添加 JWT Token 认证
- 添加登录状态持久化

Closes #123
```

#### Bug 修复

```
fix(books): 修复书籍搜索分页问题

当搜索关键词为空时，分页参数未正确传递，导致返回空列表。

Fixes #456
```

#### 重构

```
refactor(borrow): 重构借阅业务逻辑

- 提取借阅额度检查为独立方法
- 优化库存扣减逻辑
- 添加事务支持
```

---

## 三、Pull Request 规范

### 3.1 PR 标题格式

```
[类型] 简短描述

示例：
[feat] 添加用户登录功能
[fix] 修复书籍搜索分页问题
[refactor] 重构借阅业务逻辑
```

### 3.2 PR 模板

```markdown
## 变更类型
- [ ] 新功能 (feat)
- [ ] Bug 修复 (fix)
- [ ] 重构 (refactor)
- [ ] 文档更新 (docs)
- [ ] 其他: ___

## 变更描述
<!-- 描述本次变更的内容 -->

## 关联 Issue
Closes #

## 测试情况
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 手动测试已完成

## 截图（如有必要）
<!-- 添加截图 -->

## 检查清单
- [ ] 代码符合编码规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 无新增 lint 错误
```

### 3.3 Code Review 检查点

| 检查项 | 说明 |
|--------|------|
| 代码规范 | 是否符合编码规范 |
| 代码质量 | 逻辑是否清晰，是否有冗余代码 |
| 安全性 | 是否有安全漏洞 |
| 性能 | 是否有性能问题 |
| 测试 | 测试覆盖率是否足够 |
| 文档 | 文档是否需要更新 |

---

## 四、版本管理

### 4.1 版本号规范

采用语义化版本 (Semantic Versioning)：`MAJOR.MINOR.PATCH`

| 版本类型 | 说明 | 示例 |
|----------|------|------|
| MAJOR | 不兼容的 API 变更 | 1.0.0 → 2.0.0 |
| MINOR | 向后兼容的功能新增 | 1.0.0 → 1.1.0 |
| PATCH | 向后兼容的问题修复 | 1.0.0 → 1.0.1 |

### 4.2 版本发布流程

```
1. 从 develop 创建 release 分支
   git checkout develop
   git checkout -b release/v1.0.0

2. 在 release 分支进行测试和修复
   git commit -m "fix: 修复发布前发现的问题"

3. 测试通过后合并到 main
   git checkout main
   git merge --no-ff release/v1.0.0

4. 打标签
   git tag -a v1.0.0 -m "Release v1.0.0"

5. 合并回 develop
   git checkout develop
   git merge --no-ff release/v1.0.0

6. 删除 release 分支
   git branch -d release/v1.0.0

7. 推送
   git push origin main develop --tags
```

### 4.3 CHANGELOG 格式

```markdown
# Changelog

## [1.0.0] - 2025-03-27

### Added
- 用户登录功能
- 书籍管理功能
- 会员管理功能

### Changed
- 优化借阅流程

### Fixed
- 修复书籍搜索分页问题

### Security
- 修复 XSS 漏洞
```

---

## 五、Git 命令速查

### 5.1 常用命令

```bash
# 创建并切换分支
git checkout -b feature/REQ-001-user-login

# 查看分支状态
git status

# 添加文件到暂存区
git add .

# 提交变更
git commit -m "feat(auth): 添加用户登录功能"

# 推送分支
git push origin feature/REQ-001-user-login

# 拉取最新代码
git pull origin develop

# 合并分支
git merge --no-ff feature/REQ-001-user-login

# 删除分支
git branch -d feature/REQ-001-user-login

# 查看提交历史
git log --oneline --graph

# 撤销未提交的修改
git checkout -- <file>

# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 暂存当前修改
git stash
git stash pop
```

### 5.2 解决冲突

```bash
# 1. 拉取最新代码
git fetch origin
git merge origin/develop

# 2. 查看冲突文件
git status

# 3. 手动解决冲突
# 编辑冲突文件，选择保留的代码

# 4. 标记冲突已解决
git add <conflicted-file>

# 5. 完成合并
git commit -m "merge: 解决合并冲突"
```
