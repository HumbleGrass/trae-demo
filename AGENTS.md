# 图书馆借阅管理系统 - 项目文档

> 本文档基于对代码库的实际分析生成（2026-09），描述与代码保持同步。若代码发生结构性变更，请同步更新本文档。

## 项目概述

基于 Vue 3 + NestJS 构建的图书馆借阅管理系统，前后端分离，提供图书管理、会员管理、借阅、预约、逾期罚款、统计分析等完整功能。支持 admin/user 双角色权限控制和中英文国际化。视觉风格遵循根目录 `DESIGN.md` 定义的 Notion 设计语言。

## 技术栈

### 前端（`frontend/`）

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | ^3.3.0 | 前端框架（`<script setup>` 语法） |
| Vue Router | ^4.2.0 | 路由管理（History 模式） |
| Pinia | ^2.1.0 | 状态管理 |
| Element Plus | ^2.3.0 | UI 组件库（**按需引入**，编译期 SCSS 定制主题） |
| Axios | ^1.4.0 | HTTP 请求 |
| ECharts | ^5.4.0 | 图表可视化 |
| Vue I18n | ^9.0.0 | 国际化（zh-CN / en） |
| Vite | ^4.4.0 | 构建工具（配置文件为 `vite.config.mts`） |
| TypeScript | ^5.0.0 | 类型支持 |
| SCSS | ^1.63.0 | 样式预处理 |
| @fontsource/inter | ^5.3.0 | Notion 风格字体 |
| Vitest + happy-dom | ^4.1.4 | 单元测试 |
| Playwright | ^1.59.1 | E2E 测试（当前用例已清空，配置保留） |
| @monitoring/sdk-js(-vue) | file: 本地依赖 | 前端监控（错误/会话回放/链路追踪） |

### 后端（`backend/`）

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | ^10.0.0 | 后端框架 |
| TypeORM | ^0.3.0 | ORM（开发环境 `synchronize: true` 自动同步表结构） |
| MySQL | mysql2 ^3.6.0 | 数据库 |
| JWT (@nestjs/jwt + passport-jwt) | ^10.0.0 | 身份认证 |
| bcrypt | ^5.1.0 | 密码加密 |
| class-validator / class-transformer | ^0.14.0 | DTO 验证（全局 ValidationPipe：whitelist + transform + forbidNonWhitelisted） |
| Jest | ^29.5.0 | 单元测试 |

## 项目结构

```
d:\project\trae-demo\
├── frontend/                    # 前端项目（端口 5174）
│   ├── src/
│   │   ├── api/                # API 接口定义（按模块拆分）
│   │   │   ├── auth/           # 认证 API（index.ts + types.ts）
│   │   │   ├── books.ts / members.ts / borrow.ts / reservations.ts
│   │   │   ├── reports.ts / statistics.ts / system.ts
│   │   │   └── request.ts      # Axios 实例与拦截器
│   │   ├── components/
│   │   │   ├── Chart/ Modal/ Pagination/ SearchForm/   # 功能组件
│   │   │   ├── common/         # BaseModal / BaseTable / EmptyState / StatusTag / TechButton / TechCard
│   │   │   └── layout/         # TechPageLayout
│   │   ├── composables/        # useDateFormat / usePagination / useSearchForm
│   │   ├── locales/            # i18n（zh-CN.ts / en.ts）
│   │   ├── router/index.ts     # 路由与全局守卫
│   │   ├── stores/             # Pinia（user.ts / notification.ts）
│   │   ├── styles/             # Notion 设计系统（见下文「设计系统」）
│   │   ├── utils/              # echarts.ts / echarts-tech-theme.ts
│   │   ├── tests/setup.ts      # Vitest 全局 setup
│   │   └── views/              # 页面（每模块一个目录，入口为 index.vue）
│   │       ├── login/ layout/ home/
│   │       ├── books/（index.vue + detail.vue） members/ borrow/ reservations/
│   │       ├── reports/ analytics/ settings/ profile/
│   ├── vite.config.mts         # 端口/代理/按需引入/分包/压缩
│   ├── vitest.config.ts        # 单测配置（覆盖率阈值 80%）
│   ├── playwright.config.ts    # E2E 配置（baseURL http://localhost:5174）
│   └── tsconfig.json
│
├── backend/                     # 后端项目（端口 3030）
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/     # @Roles / @CurrentUser
│   │   │   ├── guards/         # RolesGuard
│   │   │   └── middleware/     # AuthLoggerMiddleware（全局注册）
│   │   ├── entities/           # TypeORM 实体（见下文）
│   │   ├── modules/            # 业务模块（auth/books/members/borrow/reservations/fines/reports/analytics/statistics/system）
│   │   │   └── <module>/       # controller + service + module + dto/ + *.spec.ts
│   │   ├── app.module.ts       # TypeORM 连接 + 模块注册
│   │   └── main.ts             # 入口：CORS、全局管道、api/v1 前缀
│   ├── .env / .env.example     # 环境变量（加载自 backend/ 目录）
│   ├── seed.ts                 # 数据库种子（npm run seed）
│   └── jest.config.js
│
├── docs/                       # 项目文档（adr / ui-design-system 等）
├── .trae/                      # Trae 配置（documents / rules / skills / specs）
└── DESIGN.md                   # Notion 设计语言规范（颜色的唯一权威来源）
```

## 端口与网络

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 Dev Server | **5174** | `vite.config.mts` 中固定；`/api` 代理到 `http://localhost:3030` |
| 后端 API | **3030** | `main.ts` 中 `process.env.PORT \|\| 3030` |
| MySQL | 3306 | 由 `backend/.env` 配置 |
| CORS 白名单 | 5173 / 5174 / 5175 / 3000 | 后端 `main.ts` 中配置，credentials: true |

## 核心功能模块（页面 ↔ 路由 ↔ 后端）

| 页面 | 路由 | 角色限制 | 后端模块 |
|------|------|---------|---------|
| 登录/注册 | `/login`（public） | - | auth |
| 首页 | `/home` | - | statistics |
| 图书管理 | `/books`、`/books/:id` | admin | books |
| 会员管理 | `/members` | admin | members |
| 借阅管理 | `/borrow` | - | borrow |
| 预约管理 | `/reservations` | - | reservations |
| 统计报表 | `/reports` | admin | reports |
| 数据分析 | `/analytics` | admin | analytics |
| 系统设置 | `/settings` | admin | system |
| 个人中心 | `/profile` | - | auth |

角色仅两种：`admin` / `user`（`UserRole` 枚举，注册用户默认 `user`）。后端通过 `@Roles(UserRole.ADMIN)` + `RolesGuard` 控制接口，前端通过路由 `meta.roles` + Pinia `role` 控制页面。

## 数据库设计

### 实体清单（`backend/src/entities/`）

| 实体 | 表名 | 说明 |
|------|------|------|
| User | users | 登录账号（含 role 枚举、isActive） |
| Member | members | 会员档案（含 borrow_limit 借阅限额） |
| Book | books | 图书（quantity / availableQuantity） |
| BorrowRecord | borrow_records | 借阅记录 |
| Reservation | reservations | 预约记录 |
| OverdueFine | overdue_fines | 逾期罚款 |
| SystemConfig / SystemMenu | system_configs / system_menus | 系统配置与菜单 |
| DataDict / LanguageConfig / ListConfig / UserPreferences | data_dicts 等 | 数据字典、语言配置、列表配置、用户偏好 |

### 实体关系

```
User (1) ── OneToOne ── (1) Member
                              │
              ┌───────────────┼────────────────┐
        (N) BorrowRecord  (N) Reservation  (N) OverdueFine
              │                   │
        (N) Book             (N) Book

BorrowRecord (N) ── ManyToOne ── (N) OverdueFine   （罚款关联借阅记录）
```

## API 接口规范

- 基础路径：`/api/v1`（后端 `setGlobalPrefix`，前端 Axios `baseURL: '/api/v1'`）
- 认证头：`Authorization: Bearer <token>`（登录/注册接口除外）
- 响应包裹结构：`{ code, message, data }`，前端拦截器统一校验 `code !== 200` 时弹出错误并 reject
- 核心认证接口：`POST /auth/register`、`POST /auth/login`、`GET /auth/profile`
- DTO 校验失败会返回 400（forbidNonWhitelisted 开启，多传字段会被拒绝）

## 启动指南

### 环境要求
- Node.js >= 16，npm >= 8，MySQL >= 5.7

### 配置 `backend/.env`（参考 `.env.example`）

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management
NODE_ENV=development
JWT_SECRET=your_jwt_secret
# PORT=3030  # 可选，默认 3030
```

### 安装与启动

```bash
# 后端
cd backend
npm install          # ⚠️ 见「常见问题」第 1 条：监控 SDK 本地依赖
npm run seed         # 初始化种子数据（图书 + 管理员账号）
npm run start:dev    # 开发服务器，端口 3030

# 前端
cd frontend
npm install
npm run dev          # 开发服务器，端口 5174
```

**种子管理员账号：`admin / admin123`**（seed.ts 创建，同时生成对应 Member 档案）

### 构建与测试

```bash
# 前端
npm run build                      # 生产构建（自动产出 .gz 预压缩文件）
npm run build -- --mode analyze    # 产物分析，结果在 dist/stats.html
npm run lint                       # ESLint
npm run test                       # Vitest 单测（覆盖率阈值 80%）
npm run test:coverage              # 覆盖率报告
npm run test:e2e                   # Playwright（当前无用例，配置保留）

# 后端
npm run build
npm run test                       # Jest（*.spec.ts 与源码同目录存放）
```

## 前端架构说明

### 路由与守卫（`router/index.ts`）
- 全局前置守卫：解析 JWT payload 做本地过期检查（`isTokenExpired`），过期或无 token 则登出并跳 `/login`
- `meta.public` 标记公开页；`meta.roles` 控制角色访问；`meta.title` 自动设置 `document.title`
- 所有业务页面挂在 `views/layout/index.vue` 主布局下

### 状态管理（Pinia）
- `stores/user.ts`：token（持久化到 localStorage）、userInfo、role，以及 login/register/profile/logout actions
- `stores/notification.ts`：通知状态

### HTTP 请求（`api/request.ts`）
- 统一拦截器：请求头自动附带 Bearer Token（登录/注册除外）
- 响应拦截：业务 code 非 200 弹错；401 清 token 并跳登录页；403/404/500 有统一提示
- Token 过期兜底依赖后端 401 响应

### Element Plus 按需引入
- `unplugin-vue-components` + `ElementPlusResolver({ importStyle: 'sass' })` 在编译期自动注入模板中使用的 `el-*` 组件与样式
- 脚本中直接调用的组件需手动引入样式（已在 `main.ts` 处理）：ElMessage / ElMessageBox / ElLoading（v-loading 指令）
- **新增页面直接在模板中使用 el-* 组件即可，无需手动 import**

## 设计系统（Notion 风格）

视觉规范唯一来源是根目录 `DESIGN.md`（色板/字阶/圆角/间距），样式分四层实现：

| 文件 | 职责 |
|------|------|
| `styles/_notion-values.scss` | 设计值源头（SCSS 变量，与 DESIGN.md 对齐） |
| `styles/design-tokens.scss` | 将 SCSS 变量导出为 `:root` CSS 变量（`--color-primary` 等） |
| `styles/element-theme.scss` | Element Plus **编译期**主题（`@forward var.scss with (...)`），由 vite `additionalData` 注入每个 SCSS 编译单元 |
| `styles/element-adjustments.scss` | 组件级微调 |
| `styles/index.scss` | 全局样式 |

**样式修改规则（强制）：**
1. 新颜色/间距必须先加到 `_notion-values.scss`，经 design-tokens 暴露为 CSS 变量后使用，禁止散落硬编码
2. Element Plus 主题定制走 `element-theme.scss` 编译期变量覆盖，禁止 `!important` 全局覆盖
3. 样式调整不得改动 API 调用、路由、权限逻辑、状态管理和组件 props 接口
4. 布局改动需在浏览器中验证桌面端/平板/手机三种视口

## 后端架构说明

- 分层：Controller → Service → TypeORM Repository，DTO 放各模块 `dto/` 目录用 class-validator 装饰器校验
- 认证：Passport JWT 策略（`modules/auth/jwt.strategy.ts`），自定义 `@Roles()` 装饰器 + `RolesGuard`，`@CurrentUser()` 取当前用户
- 全局中间件 `AuthLoggerMiddleware` 记录认证日志
- 开发环境 TypeORM `synchronize: true` 自动同步表结构；生产环境必须关闭（依赖 NODE_ENV 判断）
- 全局 ValidationPipe：`whitelist + transform + forbidNonWhitelisted`

## 开发规范

### 代码规范（强制遵守）
1. 命名：组件大驼峰 `UserList.vue`；变量/函数小驼峰 `getUserInfo()`；常量全大写 `USER_STATUS`
2. TypeScript 必须定义类型，禁止 `any`
3. 核心函数必写注释，业务逻辑说明清晰
4. Vue 使用 `<script setup>` 语法
5. 组件化：功能模块独立封装，组件间通过 props 传数据；页面入口统一为 `views/<模块>/index.vue`
6. 复用逻辑提取到 `composables/`（参考 usePagination / useSearchForm / useDateFormat）
7. 测试文件与源码同目录，命名 `<name>.spec.ts`

### Git 提交规范
Conventional Commits + 中文描述，如 `refactor(frontend): ...`、`fix(auth): ...`、`docs: ...`

### AI 协作铁律（强制遵守）
1. 需求模糊必须提问，禁止自行脑补业务逻辑
2. 每轮改动后检查 diff，避免顺手重构无关内容

### 文件存放规范
- 产出文档：`/docs`
- 测试截图：`/test_screenshots`

## 常见问题

### 1. `npm install` 失败（前端）
`package.json` 中 `@monitoring/sdk-js` 和 `@monitoring/sdk-js-vue` 是 `file:../../MY-PROJECT/monitoringSystem/sdk/packages/...` 的本地依赖，该路径不存在时安装会失败。环境变量 `VITE_MONITOR_PROJECT_ID` / `VITE_MONITOR_API_URL` 缺失时监控 SDK 静默降级，不影响功能。

### 2. 数据库连接超时
检查 `backend/.env` 连接信息；确认 MySQL 已启动。后端已配置连接池（20 连接）与重试（10 次 × 2s）。

### 3. 前端请求 401
JWT 过期：路由守卫会本地校验 token 过期时间并自动跳登录页；API 层面收到 401 会清 token 并跳转。重新登录即可。

### 4. 前后端端口对不上
后端默认 **3030**（不是 3000），前端代理 `/api` → `localhost:3030`。若修改后端 `PORT`，需同步改 `frontend/vite.config.mts` 的 proxy target。

## Agent skills

### Issue tracker

问题以本地 Markdown 文件形式存放在 `.scratch/<feature>/` 下。参见 `docs/agents/issue-tracker.md`。

### Domain docs

单上下文布局：仓库根目录一个 `CONTEXT.md` 加 `docs/adr/`。参见 `docs/agents/domain.md`。

### Triage labels

分诊角色到标签字符串的映射见 `docs/agents/triage-labels.md`（默认五个标准标签）。
