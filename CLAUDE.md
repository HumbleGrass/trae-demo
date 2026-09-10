# 图书馆借阅管理系统 - 项目文档

## 项目概述

这是一个基于 Vue.js 3 + NestJS 构建的现代化图书馆借阅管理系统，采用前后端分离架构，提供完整的图书管理、会员管理、借阅管理等核心功能。系统支持多角色权限控制、数据统计分析和国际化功能。

## 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | ^3.3.0 | 前端框架 |
| Vue Router | ^4.2.0 | 路由管理 |
| Pinia | ^2.1.0 | 状态管理 |
| Element Plus | ^2.3.0 | UI组件库 |
| Axios | ^1.4.0 | HTTP请求 |
| ECharts | ^5.4.0 | 图表可视化 |
| Vue I18n | ^9.0.0 | 国际化 |
| Vite | ^4.4.0 | 构建工具 |
| TypeScript | ^5.0.0 | 类型支持 |
| SCSS | ^1.63.0 | 样式预处理 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | ^10.0.0 | 后端框架 |
| TypeORM | ^0.3.0 | ORM框架 |
| MySQL | - | 数据库 |
| JWT | ^10.0.0 | 身份认证 |
| Passport | ^0.7.0 | 认证中间件 |
| bcrypt | ^5.1.0 | 密码加密 |
| class-validator | ^0.14.0 | 数据验证 |

## 项目结构

```
d:\project\trae-demo\
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── api/                # API接口定义
│   │   │   ├── auth/           # 认证相关API
│   │   │   ├── books.ts        # 图书API
│   │   │   ├── borrow.ts       # 借阅API
│   │   │   ├── members.ts      # 会员API
│   │   │   ├── request.ts      # Axios实例配置
│   │   │   └── ...
│   │   ├── components/         # 公共组件
│   │   │   ├── Chart/          # 图表组件
│   │   │   ├── Modal/          # 模态框组件
│   │   │   ├── Pagination/     # 分页组件
│   │   │   ├── SearchForm/     # 搜索表单组件
│   │   │   └── common/         # 通用组件
│   │   ├── locales/            # 国际化文件
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia状态管理
│   │   ├── styles/             # 全局样式
│   │   ├── views/              # 页面视图
│   │   ├── App.vue             # 根组件
│   │   └── main.ts             # 入口文件
│   ├── index.html
│   ├── vite.config.ts          # Vite配置
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── common/             # 公共模块
│   │   │   ├── decorators/     # 自定义装饰器
│   │   │   ├── guards/         # 守卫
│   │   │   └── middleware/     # 中间件
│   │   ├── entities/           # 数据库实体
│   │   │   ├── book.entity.ts
│   │   │   ├── member.entity.ts
│   │   │   ├── borrow-record.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   └── ...
│   │   ├── modules/            # 业务模块
│   │   │   ├── auth/           # 认证模块
│   │   │   ├── books/          # 图书模块
│   │   │   ├── members/        # 会员模块
│   │   │   ├── borrow/         # 借阅模块
│   │   │   ├── reservations/   # 预约模块
│   │   │   ├── fines/          # 罚款模块
│   │   │   ├── reports/        # 报表模块
│   │   │   ├── analytics/      # 分析模块
│   │   │   ├── statistics/     # 统计模块
│   │   │   └── system/         # 系统模块
│   │   ├── app.module.ts       # 应用主模块
│   │   └── main.ts             # 入口文件
│   ├── .env                    # 环境变量
│   ├── nest-cli.json
│   ├── package.json
│   └── seed.ts                 # 数据库种子
│
├── .trae/                       # Trae配置目录
│   ├── documents/              # 文档
│   ├── rules/                  # 规则配置
│   └── specs/                  # 规格说明
│
└── docs/                        # 项目文档
```

## 核心功能模块

### 1. 认证模块 (Auth)
- 用户登录/注册
- JWT Token认证
- 角色权限控制 (admin/user)
- 用户信息获取

### 2. 图书模块 (Books)
- 图书CRUD操作
- 图书分类管理
- 图书搜索与筛选
- 库存管理

### 3. 会员模块 (Members)
- 会员信息管理
- 会员借阅限额设置
- 会员状态管理

### 4. 借阅模块 (Borrow)
- 借阅记录管理
- 归还处理
- 续借功能
- 逾期状态跟踪

### 5. 预约模块 (Reservations)
- 图书预约
- 预约状态管理
- 预约取消

### 6. 罚款模块 (Fines)
- 逾期罚款计算
- 罚款记录管理
- 缴费处理

### 7. 统计分析模块
- 借阅统计
- 数据分析
- 报表生成

## 数据库设计

### 主要实体

| 实体 | 表名 | 说明 |
|------|------|------|
| User | users | 用户表 |
| Member | members | 会员表 |
| Book | books | 图书表 |
| BorrowRecord | borrow_records | 借阅记录表 |
| Reservation | reservations | 预约表 |
| OverdueFine | overdue_fines | 罚款表 |
| SystemConfig | system_configs | 系统配置表 |
| SystemMenu | system_menus | 系统菜单表 |
| DataDict | data_dicts | 数据字典表 |

### 实体关系

```
User (1) ─── (1) Member
                │
                ├── (N) BorrowRecord (N) ─── Book
                │
                └── (N) Reservation (N) ─── Book
```

## API接口规范

### 基础路径
- API前缀: `/api/v1`
- 认证头: `Authorization: Bearer <token>`


## 启动指南

### 环境要求
- Node.js >= 16.x
- MySQL >= 5.7
- npm >= 8.x

### 配置文件

后端环境变量 (`backend/.env`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 启动服务

```bash
# 启动前端开发服务器 (端口: 5174)
cd frontend
npm run dev

# 启动后端开发服务器 (端口: 3000)
cd backend
npm run start:dev
```

### 构建生产版本

```bash
# 前端构建
cd frontend
npm run build

# 后端构建
cd backend
npm run build
```

## 前端架构说明

### 路由配置
- 使用 Vue Router 4 进行路由管理
- 支持路由守卫进行权限验证
- 路由元信息包含页面标题和角色权限

### 状态管理
- 使用 Pinia 进行全局状态管理
- 主要 Store:
  - `user.ts`: 用户状态（token、用户信息、角色）
  - `notification.ts`: 通知状态

### HTTP请求
- 基于 Axios 封装请求实例
- 自动添加 JWT Token
- 统一错误处理
- 请求/响应拦截器

## 后端架构说明

### 模块化设计
- 每个业务模块独立封装
- Controller -> Service -> Repository 分层架构
- DTO 数据传输对象验证

### 认证授权
- JWT Token 认证
- Passport 策略
- 角色守卫 (RolesGuard)
- 装饰器权限控制

### 数据库操作
- TypeORM 实体映射
- 自动同步表结构 (synchronize: true)
- 实体关联关系定义

## 开发规范

### 代码规范（强制遵守）
1. 命名规范：
   - 组件：大驼峰 UserList.vue
   - 变量/函数：小驼峰 getUserInfo()
   - 常量：全大写 USER_STATUS
2. TypeScript：必须定义类型，禁止使用 any
3. 注释：核心函数必写注释，业务逻辑说明清晰
4. Vue：使用 <script setup> 语法
5. 组件化：每个功能模块独立封装为组件，组件之间通过 props 传递数据

### AI协作铁律（强制遵守）
1. 需求模糊必须提问，禁止自行脑补业务逻辑

### 文件存放规范
- 产出文档: `/docs`
- 测试文件: `/test_screenshots`

## 常见问题

### 1. 数据库连接超时
检查 `.env` 配置中的数据库连接信息是否正确，确保数据库服务已启动。

### 2. 前端请求401错误
检查 Token 是否过期，尝试重新登录获取新 Token。

### 3. 跨域问题
后端已配置 CORS，允许来自 `localhost:5173/5174/5175/3000` 的请求。
