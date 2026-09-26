# 图书馆借阅管理系统 - 全面优化实施计划

## 概述

基于对前后端代码库的全面深度审查，共发现 **150+ 个问题**，涵盖安全漏洞、并发竞态、业务逻辑 Bug、性能瓶颈、类型安全、代码规范和 UI 设计规范等多个维度。本计划按优先级分 7 个阶段实施。

---

## 当前状态分析

### 严重问题统计

| 严重级别 | 数量 | 说明 |
|---------|------|------|
| P0 致命 | 7 | 安全漏洞、数据损坏、功能完全失效 |
| P1 严重 | 12 | 竞态条件、业务逻辑 Bug、数据不一致 |
| P2 中等 | 25 | 缺失索引、硬编码值、DTO 验证不足、类型安全 |
| P3 低 | 50+ | 代码风格、未使用导入、console 残留、魔术数字 |
| UI 严重 | 3 | 双主题冲突、!important 滥用(755次)、i18n 缺失(100+处) |
| UI 高 | 5 | 硬编码颜色(218+处)、CSS/动画重复(14处)、组件设计缺陷、页面模式不一致、功能缺陷 |
| UI 中 | 7 | 无障碍缺失、CSS重复定义、TypeScript类型、ECharts不一致、响应式不足、空状态不一致 |
| UI 低 | 4 | 代码整洁度、Element Plus规范、动画性能、字体加载 |

### 之前分析遗漏的关键问题

1. **注册接口允许自选角色** — 任何人可注册为管理员（P0）
2. **userId 与 memberId 混用** — 多个 Controller 传错 ID，功能完全失效（P0）
3. **generateFineForReturn memberId 硬编码为 0** — 罚款数据全部错误（P0）
4. **中间件打印请求体含密码** — 敏感信息泄露（P0）
5. **3 个核心页面 Mock 数据阻断 API** — 图书/借阅/会员页面刷新后数据丢失（P0）
6. **认证 API 两套重复实现且类型不一致** — 前端导入混乱（P1）
7. **AnalyticsService SQL 字段名错误** — `book.available` 应为 `book.availableQuantity`（P1）
8. **Reservation 创建未设置必填字段** — reservationDate/expiryDate 为 NULL（P1）
9. **逾期状态无自动更新机制** — overdue 统计永远为 0（P1）
10. **归还时未自动生成罚款** — 罚款流程脱节（P1）

---

## 阶段一：P0 致命问题修复（安全 + 数据完整性）

### 1.1 修复注册接口角色提权漏洞

**文件**: `backend/src/modules/auth/dto/register.dto.ts`
- 移除 `role` 字段，注册时强制为 `UserRole.USER`
- 只有管理员创建会员时才可指定角色

**文件**: `backend/src/modules/auth/auth.service.ts`
- 第 34 行：将 `role: registerDto.role || UserRole.USER` 改为 `role: UserRole.USER`

### 1.2 修复 userId 与 memberId 混用

**问题**: Controller 中 `@CurrentUser() user` 的 `user.userId` 是 User 表 ID，但 Service 方法需要的是 Member 表 ID

**文件**: `backend/src/modules/borrow/borrow.controller.ts`
- 第 21、35、55、65 行：需要先通过 userId 查询对应的 memberId，再传给 Service

**文件**: `backend/src/modules/fines/fines.controller.ts`
- 第 26 行：同上

**文件**: `backend/src/modules/reservations/reservations.controller.ts`
- 第 22 行：同上

**方案**: 在 MembersService 中添加 `findByUserId` 方法（已存在），Controller 中先查询 memberId

### 1.3 修复罚款 memberId 硬编码为 0

**文件**: `backend/src/modules/fines/fines.service.ts`
- 第 64 行：`memberId: 0` → 从 BorrowRecord 中获取实际 memberId

### 1.4 清理敏感信息日志

**文件**: `backend/src/common/middleware/auth-logger.middleware.ts`
- 第 16 行：移除 `Request Body` 日志（含密码等敏感信息）
- 第 11 行：移除 Authorization 头打印

**文件**: `backend/src/modules/auth/jwt.strategy.ts`
- 第 12 行：移除 JWT Secret 打印

**文件**: `backend/src/modules/auth/auth.module.ts`
- 第 11 行：移除 JWT Secret 打印

**文件**: `backend/src/app.module.ts`
- 第 19-26 行：移除开发模式下的 DB 配置打印

### 1.5 修复前端 Mock 数据阻断 API

**文件**: `frontend/src/views/books/index.vue`
- 移除 `onMounted` 中的硬编码 Mock 数据，恢复 `fetchData()` 调用

**文件**: `frontend/src/views/borrow/index.vue`
- 移除 `onMounted` 中的硬编码 Mock 数据，恢复 `fetchData()`/`fetchMembers()`/`fetchBooks()` 调用

**文件**: `frontend/src/views/members/index.vue`
- 移除 `onMounted` 中的硬编码 Mock 数据，恢复 `fetchData()` 调用

### 1.6 环境变量安全化

**文件**: `backend/.env`
- 将当前 `.env` 改为 `.env.example`（模板），真实 `.env` 加入 `.gitignore`
- 修改弱密码 `123456` 和弱 JWT Secret

**文件**: `backend/src/app.module.ts`
- 第 38 行：`synchronize` 改为根据环境变量控制，生产环境禁用

---

## 阶段二：P1 严重问题修复（并发 + 业务逻辑）

### 2.1 借阅操作添加事务保护

**文件**: `backend/src/modules/borrow/borrow.service.ts`
- `create` 方法：使用 `@Transaction()` 或 `EntityManager.transaction()` 包裹
- 库存更新改为原子操作：`availableQuantity = availableQuantity - 1`（SQL 层面）
- `returnBook` 方法：同样添加事务，确保借阅记录更新和库存更新原子性

### 2.2 会员创建/删除添加事务保护

**文件**: `backend/src/modules/members/members.service.ts`
- `create` 方法：User 和 Member 创建包裹在事务中
- `remove` 方法：调整删除顺序（先删 Member 再删 User），包裹在事务中

### 2.3 预约创建添加事务 + 设置必填字段

**文件**: `backend/src/modules/reservations/reservations.service.ts`
- `create` 方法：添加事务保护
- 第 42-47 行：设置 `reservationDate: new Date()` 和 `expiryDate`（如 7 天后）

### 2.4 修复 AnalyticsService SQL 字段名错误

**文件**: `backend/src/modules/analytics/analytics.service.ts`
- 第 39 行：`book.available > 0` → `book.availableQuantity > 0`

### 2.5 归还时自动生成罚款

**文件**: `backend/src/modules/borrow/borrow.service.ts`
- `returnBook` 方法中：归还后调用 `FinesService.generateFineForReturn()`
- 需要注入 FinesService（注意循环依赖，使用 forwardRef）

### 2.6 修复 generateFineForReturn memberId

**文件**: `backend/src/modules/fines/fines.service.ts`
- 第 62-67 行：先查询 BorrowRecord 获取 memberId，再创建罚款记录

### 2.7 添加逾期状态自动更新

**文件**: `backend/src/modules/borrow/borrow.service.ts`
- 添加 `updateOverdueStatus()` 方法，将超期未还的记录状态更新为 OVERDUE
- 可在 `findAll` 和统计查询前调用，或使用 NestJS `@Cron()` 定时任务

### 2.8 统一前端认证 API

**文件**: `frontend/src/api/auth.ts`
- 删除此文件，统一使用 `frontend/src/api/auth/index.ts`

**文件**: `frontend/src/stores/user.ts`
- 修改导入路径：从 `@/api/auth` → `@/api/auth/index`

**文件**: `frontend/src/api/types.ts`
- 删除与 `auth/types.ts` 重复的 `LoginForm`/`RegisterForm` 定义

### 2.9 修复罚款支付幂等性

**文件**: `backend/src/modules/fines/fines.service.ts`
- `pay` 方法：添加状态检查，已支付则抛出异常

---

## 阶段三：P2 中等问题修复（性能 + 类型 + 验证）

### 3.1 添加数据库索引

**文件**: `backend/src/entities/book.entity.ts`
- `categoryId` 字段添加 `@Index()`

**文件**: `backend/src/entities/borrow-record.entity.ts`
- `status` 字段添加 `@Index()`
- 添加 `(memberId, status)` 复合索引

**文件**: `backend/src/entities/data-dict.entity.ts`
- 添加 `(type, value)` 联合唯一索引

**文件**: `backend/src/entities/language-config.entity.ts`
- 添加 `(language, module, key)` 联合唯一索引

### 3.2 修复 N+1 查询和内存问题

**文件**: `backend/src/modules/members/members.service.ts`
- `getCurrentBorrowCount`：改为直接 COUNT 查询，移除内存过滤
- `remove`：`findOne` 时需要加载 `borrowRecords` 和 `reservations` 关系

**文件**: `backend/src/modules/analytics/analytics.service.ts`
- `getReaderDemographics`：改为 SQL 聚合查询，避免加载全部会员

**文件**: `backend/src/modules/reports/reports.service.ts`
- `getBorrowStats`：改为 SQL 聚合查询

### 3.3 修复 BorrowService 与 MembersService 的借阅计数不一致

**文件**: `backend/src/modules/members/members.service.ts`
- 第 156 行：`!r.returnDate` → `r.status === BorrowStatus.BORROWED`，与 BorrowService 统一

### 3.4 补充 DTO 验证

**文件**: `backend/src/modules/auth/dto/register.dto.ts`
- 移除 `role` 字段（已在阶段一处理）
- `bio` 添加 `@MaxLength(500)`

**文件**: `backend/src/modules/members/dto/create-member.dto.ts`
- `password` 添加 `@MinLength(6)`
- `username` 添加 `@MinLength(3)`

**文件**: `backend/src/modules/borrow/dto/borrow-query.dto.ts`
- `status` 添加 `@IsEnum(BorrowStatus)` 验证

**文件**: `backend/src/modules/fines/dto/fine-query.dto.ts`
- `status` 添加枚举验证

**文件**: `backend/src/modules/books/books.controller.ts`
- `updateStock` 添加 DTO 验证类

**文件**: `backend/src/modules/members/members.controller.ts`
- `updateBorrowLimit` 添加 DTO 验证类

**文件**: `backend/src/modules/system/system.controller.ts`
- 所有 `@Body() data: any` 替换为专用 DTO 类

### 3.5 实体关系补全

**文件**: `backend/src/entities/user.entity.ts`
- 添加与 Member 的 `@OneToOne` 反向关系

**文件**: `backend/src/entities/member.entity.ts`
- 添加与 OverdueFine 的 `@OneToMany` 关系
- `email` 字段添加 `unique: true`

**文件**: `backend/src/entities/user.entity.ts`
- `email` 字段添加 `unique: true`

**文件**: `backend/src/entities/borrow-record.entity.ts`
- 移除冗余的 `returnDate` 字段（与 `actualReturnDate` 重复且从未使用）

### 3.6 前端类型安全优化

**文件**: `frontend/src/stores/user.ts`
- `userInfo` 类型从 `any` 改为 `UserInfo | null`

**文件**: `frontend/src/api/request.ts`
- 移除 3 处 `console.log` 调试日志

**文件**: `frontend/src/api/auth.ts`
- 删除此文件（已在阶段二统一）

**文件**: `frontend/src/main.ts`
- 第 16 行：`projectId` 改为 `import.meta.env.VITE_MONITOR_PROJECT_ID`
- 第 17 行：`apiUrl` 改为 `import.meta.env.VITE_MONITOR_API_URL`

### 3.7 业务配置使用 SystemConfig

**文件**: `backend/src/modules/borrow/borrow.service.ts`
- 注入 SystemConfigService
- `BORROW_DAYS`/`RENEW_DAYS`/`OVERDUE_RATE` 从 SystemConfig 读取，保留硬编码值作为默认值

**文件**: `backend/src/modules/fines/fines.service.ts`
- 同上，`OVERDUE_RATE` 从 SystemConfig 读取

---

## 阶段四：代码规范清理

### 4.1 后端 `any` 类型清理

**文件及行号**:
- `auth.service.ts` 第 112 行：`payload: any` → 定义 `JwtPayload` 接口
- `jwt.strategy.ts` 第 21 行：同上
- `borrow.controller.ts` 第 21 行：`user: any` → 定义 `RequestUser` 接口
- `members.controller.ts`、`fines.controller.ts`、`reservations.controller.ts`：同上
- `reservations.service.ts` 第 102 行：`where: any` → 使用 `FindOptionsWhere`
- `reports.service.ts` 第 20 行：同上
- `data-dict.service.ts` 第 22 行：同上
- `analytics.service.ts` 第 44、60、95 行：定义返回类型接口
- `fines.service.ts` 第 97 行：`as any` → 使用正确的 TypeORM 查询语法

### 4.2 移除未使用的导入

- `backend/src/main.ts`：移除 `MiddlewareConsumer`、`AuthLoggerMiddleware`
- `backend/src/modules/borrow/borrow.service.ts`：移除 `IsNull`
- `backend/src/modules/analytics/analytics.service.ts`：移除 `Between`
- `backend/src/modules/system/services/menu.service.ts`：移除 `TreeRepository`
- `frontend/src/stores/theme.ts`：移除未使用的 `watch`

### 4.3 前端 `any` 类型清理（高优先级视图）

**文件**: `frontend/src/views/books/index.vue`
- `tableData`、`openEditDialog`、`handleDelete` 等处的 `any` 替换为具体类型

**文件**: `frontend/src/views/borrow/index.vue`
- `memberList`、`bookList`、`getBorrows` 返回值等处的 `any` 替换

**文件**: `frontend/src/views/members/index.vue`
- `tableData`、`openEditDialog` 等处的 `any` 替换

**文件**: `frontend/src/views/home/index.vue`
- `recentActivities`、`popularBooks` 等处的 `any` 替换

### 4.4 清理 console 语句

**后端**:
- `app.module.ts`：移除 DB 配置打印
- `auth.module.ts`：移除 JWT Secret 打印
- `jwt.strategy.ts`：移除 JWT Secret 打印
- `main.ts`：保留启动信息，移除调试信息

**前端**（共 14 处）:
- `api/request.ts`：3 处调试日志
- `stores/user.ts`：1 处
- `views/` 目录下：10 处

### 4.5 CORS 和端口配置化

**文件**: `backend/src/main.ts`
- CORS origin 改为从环境变量读取
- 监听端口改为 `process.env.PORT || 3030`

---

## 阶段五：前端专项优化

### 5.1 修复响应拦截器类型问题

**文件**: `frontend/src/api/request.ts`
- 响应拦截器返回 `response.data` 导致 TypeScript 类型与实际行为不一致
- 方案：为 Axios 实例添加响应类型拦截器，或修改 API 函数的返回类型声明以匹配实际行为

### 5.2 路由守卫增强

**文件**: `frontend/src/router/index.ts`
- 添加 Token 过期检查（解析 JWT exp 字段）
- 角色校验失败时提示用户"无权访问"
- 处理页面刷新时 `userInfo` 为空的情况

### 5.3 缺失的加载/错误状态

**文件**: `frontend/src/views/books/detail.vue`
- 模板中添加 `v-loading` 指令
- 添加错误状态展示

**文件**: `frontend/src/views/analytics/index.vue`
- `onMounted` 中调用真实 API

**文件**: `frontend/src/views/settings/index.vue`
- 从 API 加载当前设置，`saveSettings` 调用真实 API

**文件**: `frontend/src/views/profile/index.vue`
- 用户统计数据从 API 获取

### 5.4 硬编码字符串提取

**文件**: `frontend/src/views/borrow/index.vue`
- `¥0.50/天` → 从系统配置获取
- `延长借阅期限7天` → 从系统配置获取

**文件**: `frontend/src/views/books/index.vue`
- 图书分类选项从 API 获取

**文件**: `frontend/src/views/layout/index.vue`
- 通知徽章数字从 API 获取

### 5.5 修复 Vite 配置

**文件**: `frontend/vite.config.ts`
- 代理 target 已正确指向 `localhost:3030`（与后端实际端口一致），无需修改
- 添加生产构建优化配置（chunk 大小限制等）

---

## 阶段六：长期优化项

### 6.1 添加单元测试

- 后端：为 Service 层编写 Jest 单元测试，优先覆盖 BorrowService、FinesService
- 前端：为 Store 和 API 层编写 Vitest 测试

### 6.2 集成 Swagger API 文档

**文件**: `backend/src/main.ts`
- 添加 `@nestjs/swagger` 配置

### 6.3 添加缓存策略

- 热门图书、统计数据等读多写少的数据添加 Redis 缓存
- 前端添加请求缓存

### 6.4 日志系统优化

- 替换 `console.log` 为 NestJS Logger
- 添加日志级别控制
- 敏感信息脱敏

### 6.5 监控和告警

- 前端已有 MonitoringSDK 集成，确保配置使用环境变量
- 后端添加健康检查端点

---

## 假设与决策

1. **userId vs memberId 问题**：假设 User 和 Member 是 1:1 关系，Controller 中需要先通过 userId 查找 memberId
2. **事务方案**：使用 TypeORM 的 `EntityManager.transaction()` 方式，不引入额外依赖
3. **逾期状态更新**：采用查询时即时更新方案（在 findAll 等方法中先更新再查询），同时添加可选的 Cron 定时任务
4. **前端认证 API 统一**：保留 `auth/index.ts` 版本（有类型定义），删除 `auth.ts` 版本
5. **Mock 数据移除**：直接删除硬编码数据，恢复 API 调用，前提是后端 API 可用
6. **BorrowRecord.returnDate 冗余字段**：先标记为 deprecated，不立即删除避免数据库迁移问题

---

## 验证步骤

### 阶段一验证
- [ ] 注册接口无法指定 admin 角色
- [ ] 借阅/归还/续借/罚款接口使用正确的 memberId
- [ ] 罚款记录中 memberId 不再为 0
- [ ] 日志中不再出现密码、JWT Secret、DB 配置
- [ ] 图书/借阅/会员页面刷新后数据来自 API
- [ ] `.env` 文件不在版本控制中

### 阶段二验证
- [ ] 并发借阅不会导致超借（availableQuantity 不为负）
- [ ] 会员创建失败不会留下孤立 User
- [ ] 预约创建后 reservationDate 和 expiryDate 有值
- [ ] AnalyticsService 推荐接口不报 SQL 错误
- [ ] 归还逾期书籍后自动生成罚款记录
- [ ] 逾期状态能正确更新

### 阶段三验证
- [ ] 数据库索引已创建（通过 EXPLAIN 验证查询计划）
- [ ] 大数据量下统计查询不会 OOM
- [ ] DTO 验证生效（传入非法参数返回 400）
- [ ] TypeScript 编译无 any 类型警告

### 阶段四验证
- [ ] `npm run build` 前后端均无编译错误
- [ ] ESLint 无新增警告
- [ ] 生产代码中无 console.log

### 阶段五验证
- [ ] 前端 API 调用返回类型与实际数据一致
- [ ] 过期 Token 在路由守卫中被拦截
- [ ] 所有页面有 loading 状态

---

## 阶段七：前端 UI 设计规范修复

### 7.1 统一主题系统（严重）

**问题**: `index.scss` 定义了浅色主题变量 (`--color-*`)，`tech-theme.scss` 定义了暗色科技主题变量 (`--tech-*`)，两套变量体系并存，字体系统冲突（Outfit/Plus Jakarta Sans vs Orbitron/Rajdhani/JetBrains Mono），增加约 200KB+ 页面体积。

**文件**: `frontend/src/styles/index.scss`
- 移除未使用的浅色主题变量和字体导入（Outfit、Plus Jakarta Sans）
- 保留科技主题作为唯一主题系统
- 将 `--color-*` 变量映射到 `--tech-*` 变量，确保向后兼容

**文件**: `frontend/src/styles/tech-theme.scss`
- 作为唯一主题定义文件
- 补充缺失的语义化变量（如 `--tech-text-muted`、`--tech-text-dimmed`）

### 7.2 消除 `!important` 滥用（严重）

**问题**: 跨 13 个文件共 755 次 `!important`，其中 `index.scss` 559 次、`SearchForm` 46 次、`Pagination` 33 次、`TechButton` 19 次。导致组件级样式无法覆盖，维护性极差。

**文件**: `frontend/src/styles/index.scss`（559 处）
- 通过提高选择器特异性替代 `!important`（如使用 `body .el-*` 或 `.tech-theme .el-*`）
- 使用 CSS 层叠规则（@layer）控制优先级

**文件**: `frontend/src/components/SearchForm/index.vue`（46 处）
- 使用 scoped style + 深度选择器 `:deep()` 替代 `!important`

**文件**: `frontend/src/components/Pagination/index.vue`（33 处）
- 同上

**文件**: `frontend/src/components/common/TechButton.vue`（19 处）
- 重构样式为基于 CSS 变量的方案，减少覆盖需求

**文件**: `frontend/src/views/login/index.vue`（31 处）
- `frontend/src/views/layout/index.vue`（21 处）
- 同上策略

### 7.3 完善 i18n 国际化覆盖（严重）

**问题**: 100+ 处硬编码中文文本，i18n 语言包仅覆盖 common/login/menu/home/books/borrow 六个模块，缺少 members/reservations/reports/analytics/settings/profile 模块。

**文件**: `frontend/src/locales/zh-CN.ts` 和 `frontend/src/locales/en.ts`
- 补充 members/reservations/reports/analytics/settings/profile 模块的翻译

**文件**: `frontend/src/components/common/StatusTag.vue`（第 67-91 行）
- 14 个状态文本硬编码中文，改为使用 `t()` 函数

**文件**: `frontend/src/views/login/index.vue`（30+ 处硬编码中文）
- 替换为 `$t('login.xxx')` 格式

**文件**: `frontend/src/views/home/index.vue`（10+ 处）
- 问候语、时间格式化等替换为 i18n

**文件**: `frontend/src/views/books/index.vue`、`borrow/index.vue`、`members/index.vue` 等
- 所有页面标题、按钮文本、表单标签、提示信息替换为 i18n

**文件**: `frontend/src/components/SearchForm/index.vue`、`Pagination/index.vue`、`Chart/index.vue`、`EmptyState.vue`
- 组件内硬编码中文替换为 i18n

### 7.4 硬编码颜色替换为 CSS 变量（高）

**问题**: `#00f3ff` 跨 10 个文件出现 100 次，其他高频硬编码颜色（`#8080a0`、`#606099`、`#e0e0ff`、`#b0b0d0`、`#ff00ff`、`#00ff88`、`#ff3366`、`#0a0a1a`）跨 10 个文件出现 118 次。

**文件**: `frontend/src/styles/tech-theme.scss`
- 补充缺失的语义化颜色变量：
  - `--tech-neon-cyan: #00f3ff`
  - `--tech-neon-magenta: #ff00ff`
  - `--tech-neon-green: #00ff88`
  - `--tech-neon-red: #ff3366`
  - `--tech-text-muted: #8080a0`
  - `--tech-text-dimmed: #606099`
  - `--tech-bg-dark: #0a0a1a`

**全局替换**:
- `#00f3ff` → `var(--tech-neon-cyan)` 或 `var(--tech-primary-500)`
- `#8080a0` → `var(--tech-text-muted)`
- `#ff00ff` → `var(--tech-neon-magenta)`
- `#00ff88` → `var(--tech-neon-green)`
- `#ff3366` → `var(--tech-neon-red)`
- `#0a0a1a` → `var(--tech-bg-dark)`

**文件**: `frontend/src/views/settings/index.vue`（第 103、116 行）
- `el-switch` 的 `active-color="#00f3ff"` 和 `inactive-color="#3a3a4a"` 改用 CSS 变量

**文件**: `frontend/src/views/layout/index.vue`（第 199、215 行）
- `el-avatar :color="'#00f3ff'"` 改用 CSS 变量

### 7.5 提取公共 CSS 动画（高）

**问题**: `.glitch-text` + `@keyframes glitch-1/glitch-2` 在 3 个文件重复定义；`.tech-grid-bg` + `.scanline-effect` + `@keyframes scanline` 在 4 个文件重复定义；`@keyframes blink` 在 5 个文件重复定义。

**文件**: `frontend/src/styles/tech-theme.scss`
- 将以下动画统一定义在此文件中：
  - `.glitch-text` + `@keyframes glitch-1`, `glitch-2`
  - `.tech-grid-bg` + `.scanline-effect` + `@keyframes scanline`
  - `@keyframes blink`
  - `.shimmer` 动画

**删除重复定义**:
- `frontend/src/views/layout/index.vue`（第 357-395、643-684 行）
- `frontend/src/views/home/index.vue`（第 600-635、674-714 行）
- `frontend/src/views/login/index.vue`（第 497-551、734 行）
- `frontend/src/views/reports/index.vue`（第 476 行）
- `frontend/src/views/analytics/index.vue`（第 503 行）
- `frontend/src/views/settings/index.vue`（第 323 行）
- `frontend/src/views/profile/EditProfileForm.vue`（第 375 行）
- `frontend/src/components/layout/TechPageLayout.vue`（第 42-71、137-140 行）

### 7.6 修复组件设计缺陷（高）

**文件**: `frontend/src/components/common/TechCard.vue`
- 添加 `#header` 插槽支持（reservations/reports/analytics/settings 页面均使用但未定义）
- 添加 `showDecor` prop 控制角落装饰显隐

**文件**: `frontend/src/components/common/TechButton.vue`
- 添加 `ghost` 变体支持
- 调整 height 与 Element Plus 默认尺寸对齐（default: 40px, small: 32px）
- `icon` prop 类型从 `any` 改为 `Component | string`

**文件**: `frontend/src/components/common/StatusTag.vue`
- 添加大写状态值映射（PENDING/CONFIRMED/COMPLETED/CANCELLED）
- 状态文本使用 i18n

**文件**: `frontend/src/components/layout/TechPageLayout.vue`
- 移除 `min-height: 100vh`，避免与 layout 组件双滚动条
- `// ` 前缀改为可配置 prop
- 页面标题 `font-size: 42px` 调整为更合理的尺寸

**文件**: `frontend/src/components/SearchForm/index.vue`
- `searchForm` 从 `fields` prop 初始化
- `handleReset` 将值设为 `undefined` 而非 `''`，确保 select 组件正确清空

### 7.7 统一页面设计模式（高）

**搜索表单统一**:
- `books/index.vue` 和 `borrow/index.vue` 改为使用 `SearchForm` 组件
- `members/index.vue` 添加搜索表单

**分页组件统一**:
- `books/index.vue` 和 `members/index.vue` 改为使用自定义 `Pagination` 组件

**状态值格式统一**:
- 约定全部使用小写状态值（与后端 BorrowStatus/ReservationStatus 枚举一致）
- `reservations/index.vue` 中的大写状态值改为小写

**统计卡片统一**:
- 定义统一的统计卡片组件或模式
- 各页面统计区域布局保持一致

**表格标题区域统一**:
- 统一使用 TechCard `#header` 插槽

### 7.8 无障碍性修复（中）

**文件**: `frontend/src/views/layout/index.vue`
- 折叠按钮、主题切换、语言切换、通知按钮添加 `aria-label`

**文件**: `frontend/src/views/login/index.vue`
- 表单输入框添加 `aria-label` 和 `aria-required`
- 登录/社交登录按钮添加 `aria-label`

**文件**: `frontend/src/views/home/index.vue`
- 快捷操作按钮添加 `aria-label`

**全局**: 所有图标按钮添加屏幕阅读器可访问文本

### 7.9 响应式设计增强（中）

**文件**: `frontend/src/views/layout/index.vue`
- 添加 1024px 平板断点
- 移动端适配面包屑、用户信息、时间显示（而非直接隐藏）

**文件**: `frontend/src/views/home/index.vue`
- 统计卡片和内容网格添加响应式断点

**文件**: `frontend/src/views/books/index.vue`、`borrow/index.vue`
- 搜索表单和表格添加响应式适配

**文件**: `frontend/src/views/borrow/index.vue`
- 弹窗在移动端宽度适配

### 7.10 空状态和加载状态统一（中）

**文件**: `frontend/src/views/home/index.vue`
- 活动列表和热门图书添加空状态处理

**文件**: `frontend/src/views/books/index.vue`、`borrow/index.vue`
- 使用 `EmptyState` 组件替代默认空文本

**文件**: `frontend/src/views/reservations/index.vue`
- 使用 `EmptyState` 组件替代 `empty-text`

**文件**: `frontend/src/views/analytics/index.vue`、`settings/index.vue`、`profile/index.vue`
- 添加加载状态

### 7.11 登录页 CSS 重复定义修复（中）

**文件**: `frontend/src/views/login/index.vue`
- 移除重复的 `.logo-container`（第 618-622 行与 634-639 行，保留 80px 版本）
- 移除重复的 `.system-title`（第 624-627 行与 689-700 行，保留 36px 版本）
- 移除重复的 `.system-subtitle`（第 629-632 行与 702-710 行，保留 12px 版本）

### 7.12 ECharts 使用统一（中）

**文件**: `frontend/src/views/home/index.vue`
- 将直接使用 `echarts.init()` 改为使用 `Chart` 组件

**文件**: `frontend/src/components/Chart/index.vue`
- `applyTechTheme` 函数中硬编码颜色改为使用 CSS 变量或共享主题配置
- 移除与 `echarts-tech-theme.ts` 重复的逻辑

### 7.13 封面颜色统一（中）

**文件**: `frontend/src/views/home/index.vue`（第 313-320 行）
- `coverColors` 提取为共享常量或 CSS 变量

**文件**: `frontend/src/views/books/detail.vue`（第 186-193 行）
- `getCoverColor` 使用与 home 页相同的颜色方案

### 7.14 动画性能优化（低）

**文件**: `frontend/src/views/login/index.vue`
- 粒子背景 + 扫描线 + 网格背景 + 全息效果四重动画叠加，考虑根据设备性能降级
- 使用 `prefers-reduced-motion` 媒体查询为敏感用户禁用动画

**文件**: `frontend/src/views/home/index.vue`
- `.scanline-effect` + `.tech-grid-bg` + `glitch-text` 三重持续动画，添加性能降级

**文件**: `frontend/src/components/common/StatusTag.vue`
- `shimmer` 动画考虑仅在 hover 时触发，而非持续运行

### 7.15 字体加载优化（低）

**文件**: `frontend/src/styles/tech-theme.scss`（第 6 行）
- Google Fonts 外部加载添加 `font-display: swap` 避免 FOIT
- 考虑将字体文件本地化

**文件**: `frontend/src/styles/index.scss`（第 1 行）
- 移除与科技主题冲突的 Outfit/Plus Jakarta Sans 字体导入

### 阶段七验证
- [ ] 仅存在一套主题变量体系，无冲突
- [ ] `!important` 使用次数降至 50 次以下
- [ ] 所有页面文本使用 i18n，切换语言后界面完整
- [ ] 无硬编码颜色值（除 CSS 变量定义处）
- [ ] 公共动画仅在 `tech-theme.scss` 中定义一次
- [ ] TechCard `#header` 插槽正常工作
- [ ] 所有页面搜索表单、分页、空状态组件使用一致
- [ ] 图标按钮有 `aria-label`
- [ ] 平板和移动端布局正常
- [ ] Lighthouse 无障碍评分 > 80
