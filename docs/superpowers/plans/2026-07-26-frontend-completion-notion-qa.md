# 图书馆前端功能补全与 Notion 风格统一实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan.

**目标：** 修复本轮 QA 确认的权限、接口契约、数据真实性和工程质量问题，在不改变既有路由地址、公共组件 props、Pinia 结构及对外 API 路径的前提下，完成前端核心业务闭环，并按 DESIGN.md 分页面迁移到统一的 Notion 风格。

**架构：** 先建立可重复执行的测试基线，再按“认证与会员身份 -> 角色化页面 -> 业务闭环 -> 数据真实性 -> 视觉迁移 -> 多端回归”推进。功能修复与样式迁移分开提交；页面只消费角色适配后的 API，不在组件内绕过权限。Notion 样式以现有 SCSS Token 为唯一来源，通过 Element Plus 主题层和共享组件收口，逐页删除旧科技霓虹样式。

**技术栈：** Vue 3、TypeScript、Pinia、Vue Router、Element Plus、SCSS、Axios、Vitest、Vue Test Utils、Playwright、NestJS、TypeORM、Jest。

---

## 一、QA 结论与范围

### 1.1 当前完成度

| 模块 | 状态 | 已完成 | 待完成 |
|---|---|---|---|
| 登录 | 基本完成 | 登录、JWT、失败提示、空表单校验、三端布局 | 深链角色恢复、国际化警告 |
| 注册 | 部分完成 | 创建 User 并自动登录 | 创建/补全 Member，确保可借阅和预约 |
| 首页 | 部分完成 | 管理员基础统计接口可用 | 普通用户接口分流、快捷操作按角色、移除模拟趋势 |
| 图书 | 部分完成 | 列表、搜索、详情、编辑/删除代码路径 | 新增字段契约、分类 API、导出、移动端表格 |
| 会员 | 部分完成 | 列表、搜索、编辑 | 新增、删除、导出、账号与会员关系 |
| 借阅 | 部分完成 | 管理员列表和表单界面、后端借还续接口 | 普通用户我的借阅、管理员归还/续借身份错误、导出 |
| 预约 | 部分完成 | 列表和取消界面、后端接口 | 角色接口分流、从图书详情创建、管理员取消、详情 |
| 罚款 | 未完成 | 后端查询和缴费接口 | 前端 API、路由、列表、我的罚款、缴费 |
| 报表 | 部分完成 | 页面和部分计数请求 | 接入 reports/statistics API，替换固定数组，导出 |
| 数据分析 | 未完成 | 图表外壳 | 接入 analytics API、加载/空/错状态 |
| 系统设置 | 未完成 | 表单外壳 | 读取和保存 system/config，字段映射和校验 |
| 个人中心 | 未完成 | 展示和编辑外壳 | 真实统计、真实保存、移除不存在的收藏数据 |
| 国际化 | 部分完成 | 基础中英文资源 | layout 键、组件图标、路由标题编码、全页覆盖 |
| Notion 风格 | 部分完成 | Token 层和登录页 | 登录后全部页面、共享组件、图表和移动端 |
| 自动化测试 | 不可用 | 少量单测可通过 | ESLint、Vitest 环境、后端过期测试、E2E 浏览器 |

### 1.2 本轮证据

- 浏览器报告：test_screenshots/qa-2026-07-26/report.md
- 桌面证据：test_screenshots/qa-2026-07-26/screenshots
- 前端 build：通过，存在约 1.0 MB 和 1.3 MB 大 chunk 警告
- 后端 build：通过
- 前端 test：54 项中 31 项失败
- 后端 test：10 个套件中 7 个失败，52 项中 15 项失败
- lint：缺少 ESLint 配置，命令无法启动
- Playwright：80 项未启动，原因是本机浏览器内核未安装

### 1.3 实施约束

- 不更改既有 URL、后端 API 路径、权限含义、Pinia Store 对外结构和公共组件 props。
- 功能修复允许修正前后端 DTO 映射和控制器内部身份解析，但保持 API 地址稳定。
- 样式任务不夹带业务重构；每次只迁移一个页面或一组共享组件。
- 禁止使用全局 !important 覆盖 Element Plus；使用 SCSS 变量、CSS 变量和局部类。
- 所有新增代码使用明确类型，不新增 any。
- 每一阶段先写失败测试，再做最小实现，最后检查 diff、lint、test、build。

---

## 二、优先级与里程碑

| 优先级 | 目标 | 完成标志 |
|---|---|---|
| P0 | 恢复角色、会员身份与借阅/预约主流程 | 普通用户可注册后借阅/预约；管理员深链和管理动作可用 |
| P1 | 补齐 CRUD、真实统计、设置和个人资料 | 所有可见按钮有真实结果或被明确移除 |
| P1 | 建立自动化质量门禁 | lint、前后端单测、核心 E2E 全绿 |
| P2 | 完成 Notion 风格迁移 | 登录后页面不再出现霓虹、暗色科技卡和硬编码结构色 |
| P2 | 完成桌面/平板/手机回归 | 1440、768、390 视口无重叠、裁切和不可达操作 |

---

## 三、详细实施任务

### Task 1：修复测试与静态检查基线

**文件：**

- 新建：frontend/eslint.config.js 或 frontend/.eslintrc.cjs
- 修改：frontend/vitest.config.ts
- 修改：frontend/src/tests/setup.ts
- 修改：frontend/src/views/books/index.spec.ts
- 修改：frontend/src/views/borrow/index.spec.ts
- 修改：frontend/src/views/members/index.spec.ts
- 修改：backend/src/modules/borrow/borrow.service.spec.ts
- 修改：backend/src/modules/borrow/borrow.controller.spec.ts
- 修改：backend/src/modules/members/members.service.spec.ts
- 修改：backend/src/modules/members/members.controller.spec.ts
- 修改：backend/src/modules/fines/fines.service.spec.ts
- 修改：backend/src/modules/fines/fines.controller.spec.ts
- 修改：backend/src/modules/auth/auth.controller.spec.ts

- [ ] 1.1 在 Vitest 配置中排除 tests/e2e，先运行 npm.cmd test，确认 Playwright describe 错误消失。
- [ ] 1.2 在 setup.ts 创建统一 mount helper，安装 Element Plus、I18n、Router 和 Pinia。
- [ ] 1.3 更新三个页面测试的 API mock 名称，使其与当前 books.ts、borrow.ts、members.ts 导出一致。
- [ ] 1.4 添加 ESLint 配置，启用 Vue 3、TypeScript、禁止显式 any 和未使用变量规则。
- [ ] 1.5 更新后端过期 fixture：available 改为 availableQuantity、状态改用 BorrowStatus、补 DataSource mock 和最新 DTO 必填字段。
- [ ] 1.6 运行质量基线：

~~~powershell
cd frontend
npm.cmd run lint
npm.cmd test
npm.cmd run build

cd ..\backend
npm.cmd test -- --runInBand
npm.cmd run build
~~~

预期：所有命令退出码为 0。提交建议：test: restore frontend and backend quality gates

### Task 2：恢复登录态角色并打通注册到会员档案

**文件：**

- 修改：frontend/src/router/index.ts
- 修改：frontend/src/stores/user.ts
- 修改：frontend/src/api/auth/types.ts
- 修改：backend/src/modules/auth/auth.module.ts
- 修改：backend/src/modules/auth/auth.service.ts
- 修改：backend/src/modules/auth/auth.service.spec.ts
- 修改：backend/src/modules/members/members.service.ts
- 新建或修改：frontend/tests/e2e/auth.spec.ts

- [ ] 2.1 添加失败测试：带有效 Token 冷启动直接访问 /books 时，先获取 profile，再判断 roles。
- [ ] 2.2 在 Store 增加可复用的 ensureUserInfoAction，避免并发重复请求；路由守卫 await 身份恢复。
- [ ] 2.3 明确注册策略：注册事务同时创建默认 Member；缺少姓名、证件号等业务必填项时，新增“会员资料待补全”状态，而不是创建不可用账号。
- [ ] 2.4 后端使用事务保存 User 和 Member，并保证回滚；补唯一约束冲突测试。
- [ ] 2.5 前端注册成功后若资料未完整，导航到 /profile 并显示补全表单；完成后才能借阅/预约。
- [ ] 2.6 添加 E2E：注册 -> 补全会员资料 -> 刷新 -> 角色和会员身份保持。

核心断言：

~~~ts
expect(router.currentRoute.value.fullPath).toBe('/books')
expect(userStore.role).toBe('admin')
expect(await memberRepository.findOneBy({ userId: user.id })).not.toBeNull()
~~~

预期：新账号请求 GET /members/profile 返回 200。提交建议：fix: hydrate roles and create member profiles on registration

### Task 3：按角色重构首页数据源和快捷操作

**文件：**

- 修改：frontend/src/views/home/index.vue
- 修改：frontend/src/api/statistics.ts
- 修改：frontend/src/api/borrow.ts
- 修改：frontend/src/api/reservations.ts
- 新建：frontend/src/views/home/index.spec.ts

- [ ] 3.1 写普通用户首页测试，断言不调用 getBorrows 和管理员 reports API。
- [ ] 3.2 管理员使用 dashboard、hot-books、全量借阅；普通用户使用 getMyBorrows、getMyReservations 和公开图书排名接口。
- [ ] 3.3 快捷操作按角色拆分：管理员显示新增图书/会员/报表；普通用户显示查找图书/我的借阅/我的预约。
- [ ] 3.4 将图标组件放入 shallowRef/markRaw 或普通常量，消除 reactive component 警告。
- [ ] 3.5 删除固定趋势数组；后端无数据时显示空态，不伪造折线。
- [ ] 3.6 agent-browser 复测普通用户首页，要求所有业务 XHR 为 200 或合理空结果。

预期：普通用户首页不再出现 403 和管理员入口。提交建议：fix: make dashboard data and actions role-aware

### Task 4：修复图书契约并补齐图书、会员 CRUD

**文件：**

- 修改：frontend/src/api/books.ts
- 修改：frontend/src/views/books/index.vue
- 修改：frontend/src/views/books/index.spec.ts
- 修改：frontend/src/api/members.ts
- 修改：frontend/src/views/members/index.vue
- 修改：frontend/src/views/members/index.spec.ts
- 视契约选择修改：backend/src/modules/books/dto/create-book.dto.ts

- [ ] 4.1 写新增图书失败测试，断言表单提交 categoryId，而不是 category。
- [ ] 4.2 从 GET /books/categories 获取真实分类，选择器保存数字 ID；列表展示分类名称。
- [ ] 4.3 修复 :label=\"图书\" 为静态 label，文学标签不再向 Element Plus 传空 type。
- [ ] 4.4 实测新增 QA 图书、搜索、编辑、删除完整闭环；测试后只删除 QA 前缀数据。
- [ ] 4.5 会员页补“新增会员”和“删除”动作，复用后端 POST/DELETE /members；表单包含 username、password 和会员必填字段。
- [ ] 4.6 为图书和会员导出实现 CSV 下载；如果产品不需要导出，则移除按钮，禁止保留无事件控件。
- [ ] 4.7 增加 API 契约测试，覆盖分页返回结构 data/total。

预期：POST /books 返回 201；会员 CRUD 可由管理员完成。提交建议：fix: align catalog contracts and complete member CRUD

### Task 5：修复借阅的用户端与管理员端闭环

**文件：**

- 修改：frontend/src/views/borrow/index.vue
- 修改：frontend/src/api/borrow.ts
- 修改：frontend/src/views/borrow/index.spec.ts
- 修改：backend/src/modules/borrow/borrow.controller.ts
- 修改：backend/src/modules/borrow/borrow.service.ts
- 修改：backend/src/modules/borrow/borrow.controller.spec.ts
- 修改：backend/src/modules/borrow/borrow.service.spec.ts
- 修改：frontend/tests/e2e/borrow.spec.ts

- [ ] 5.1 写角色测试：普通用户调用 /borrow/my，不调用 /members；管理员调用分页列表和会员列表。
- [ ] 5.2 普通用户隐藏会员选择器和管理型新增入口，只展示自己的记录、续借和允许的归还动作。
- [ ] 5.3 后端创建借阅时把 userId 解析为 Member.id；管理员传 memberId 时仍使用目标会员。
- [ ] 5.4 修复管理员归还/续借：管理员按 borrowId 操作记录，不再尝试查询管理员自己的 Member。
- [ ] 5.5 将续借上限和罚金标准读取自 system/config，删除页面硬编码 1 次和 0.50 元。
- [ ] 5.6 实现 CSV 导出或移除“开发中”入口。
- [ ] 5.7 E2E 创建专用会员和图书，执行借阅 -> 续借 -> 归还，断言库存和状态变化，最后清理 QA 数据。

预期：普通用户和管理员都没有 403/404，记录状态与库存一致。提交建议：fix: complete role-aware borrow lifecycle

### Task 6：完成预约和罚款功能

**文件：**

- 修改：frontend/src/views/reservations/index.vue
- 修改：frontend/src/components/SearchForm/index.vue
- 修改：frontend/src/views/books/detail.vue
- 修改：frontend/src/api/reservations.ts
- 新建：frontend/src/api/fines.ts
- 新建：frontend/src/views/fines/index.vue
- 修改：frontend/src/router/index.ts
- 修改：frontend/src/views/layout/index.vue
- 修改：backend/src/modules/reservations/reservations.controller.ts
- 新建：frontend/tests/e2e/reservations.spec.ts
- 新建：frontend/tests/e2e/fines.spec.ts

- [ ] 6.1 把 SearchForm 模板的 searchFields 改为 props.fields，并增加 props 更新测试。
- [ ] 6.2 普通用户使用 /reservations/my；管理员使用 /reservations/all。
- [ ] 6.3 从图书详情携带 bookId 进入预约页时，展示确认对话框并调用 POST /reservations。
- [ ] 6.4 管理员取消预约按记录操作；普通用户取消时继续校验记录归属。
- [ ] 6.5 实现真实预约详情，不再仅显示 ElMessage。
- [ ] 6.6 新增罚款 API 和页面：管理员列表/缴费，普通用户我的罚款/未缴合计；菜单按角色展示。
- [ ] 6.7 E2E 覆盖无库存图书预约、取消、逾期罚款展示和管理员缴费。

预期：预约创建/查询/取消和罚款查询/缴费均有前端闭环。提交建议：feat: complete reservations and fines workflows

### Task 7：替换个人资料、设置、报表和分析中的模拟数据

**文件：**

- 修改：frontend/src/views/profile/index.vue
- 修改：frontend/src/views/profile/EditProfileForm.vue
- 修改：frontend/src/api/auth/index.ts
- 修改：backend/src/modules/auth/auth.controller.ts
- 修改：backend/src/modules/auth/auth.service.ts
- 修改：frontend/src/views/settings/index.vue
- 修改：frontend/src/api/system.ts
- 修改：frontend/src/views/reports/index.vue
- 修改：frontend/src/views/analytics/index.vue
- 新建：frontend/src/api/analytics.ts
- 修改：frontend/src/api/reports.ts

- [ ] 7.1 为资料更新增加 PATCH /auth/profile 或复用明确的用户资料接口，并添加鉴权测试。
- [ ] 7.2 个人统计从 /borrow/my、/reservations/my、/fines/my 汇总；删除不存在业务来源的 favorites。
- [ ] 7.3 设置页 onMounted 调 getSystemConfig，保存调 updateSystemConfig，字段映射 maxBorrow/defaultDays 等统一为后端字段。
- [ ] 7.4 报表页使用 borrow-stats、hot-books、member-activity、category-distribution；处理空数据。
- [ ] 7.5 分析页使用 borrow-trend、reader-demographics、book-rankings、member-growth；移除全部固定数组。
- [ ] 7.6 每个页面实现 loading、empty、error、retry 四种状态。
- [ ] 7.7 浏览器网络断言：点击保存必须出现 PATCH；图表刷新必须出现对应 GET。

预期：新账号统计为真实 0，刷新后设置和资料仍保留。提交建议：fix: replace simulated data with persisted APIs

### Task 8：修复国际化、图标和控制台警告

**文件：**

- 修改：frontend/src/locales/zh-CN.ts
- 修改：frontend/src/locales/en.ts
- 修改：frontend/src/views/layout/index.vue
- 修改：frontend/src/router/index.ts
- 修改：frontend/src/views/books/index.vue
- 修改：frontend/src/views/home/index.vue

- [ ] 8.1 补 layout.navigation、management、operations、analytics、admin、member。
- [ ] 8.2 显式导入 Translate，或使用已全局注册且名称正确的 Element Plus 图标。
- [ ] 8.3 修复路由 title 文件编码，统一使用 i18n key 而不是乱码中文常量。
- [ ] 8.4 清除 ElTag 无效 type、未定义属性和 reactive component 警告。
- [ ] 8.5 切换中文/英文遍历所有菜单和核心页面，禁止显示原始资源键。
- [ ] 8.6 agent-browser 执行 console 和 errors，预期无应用级 warning/error。

提交建议：fix: complete translations and eliminate runtime warnings

### Task 9：收口 Notion 设计基础层

**文件：**

- 修改：frontend/src/styles/_notion-values.scss
- 修改：frontend/src/styles/design-tokens.scss
- 修改：frontend/src/styles/element-overrides.scss
- 修改：frontend/src/styles/element-adjustments.scss
- 修改：frontend/src/styles/index.scss
- 修改：frontend/src/components/common/TechButton.vue
- 修改：frontend/src/components/common/TechCard.vue
- 修改：frontend/src/components/common/StatusTag.vue
- 修改：frontend/src/components/layout/TechPageLayout.vue
- 修改：frontend/src/components/Chart/index.vue

- [ ] 9.1 保留现有对外组件名和 props，只把内部 class 和样式语义迁移为中性设计。
- [ ] 9.2 Element Plus 在编译/变量层设置主色 #0075de、4px 输入圆角、8px 工具按钮、发丝边框和轻阴影。
- [ ] 9.3 删除共享组件中的霓虹、扫描线、网格、发光边框和多色结构渐变。
- [ ] 9.4 将卡片改为白色表面 + #e6e6e6 边框，页面使用 #f6f5f4，正文使用近黑/暖灰。
- [ ] 9.5 图表采用近黑文字、灰色网格和单一蓝主序列；其他颜色仅用于必要语义区分。
- [ ] 9.6 添加视觉静态检查脚本，禁止业务组件新增 #00f3ff、#ff00ff、tech-neon 和结构性渐变。
- [ ] 9.7 运行 build，确认不新增全局 !important。

验收目标：旧科技变量只保留临时兼容映射，业务页面不直接使用。提交建议：style: establish shared Notion application chrome

### Task 10：按页面分批完成 Notion 样式迁移

**批次 A 文件：**

- frontend/src/views/layout/index.vue
- frontend/src/views/home/index.vue

**批次 B 文件：**

- frontend/src/views/books/index.vue
- frontend/src/views/books/detail.vue
- frontend/src/views/members/index.vue

**批次 C 文件：**

- frontend/src/views/borrow/index.vue
- frontend/src/views/reservations/index.vue
- frontend/src/views/fines/index.vue

**批次 D 文件：**

- frontend/src/views/reports/index.vue
- frontend/src/views/analytics/index.vue
- frontend/src/views/settings/index.vue
- frontend/src/views/profile/index.vue
- frontend/src/views/profile/EditProfileForm.vue

- [ ] 10.1 批次 A：暖白画布、白色侧栏、5px 菜单行、蓝色选中指示、无扫描线；首页改为紧凑工作台。
- [ ] 10.2 批次 A 截图 1440/768/390，检查首页下一段内容可见且无超长装饰区。
- [ ] 10.3 批次 B：统一搜索条、数据表、对话框；移除大号装饰图标和发光统计。
- [ ] 10.4 批次 B 截图并检查表格在 390 视口使用横向滚动或移动行布局，不裁切固定操作列。
- [ ] 10.5 批次 C：统一状态标签、操作菜单、确认对话框，危险动作使用语义红而非霓虹。
- [ ] 10.6 批次 D：图表和设置表单采用文档式分区，不使用卡片嵌套和固定假数据。
- [ ] 10.7 每一批完成后检查 git diff，仅允许当前批次文件和对应测试变化。
- [ ] 10.8 每一批分别提交，禁止一次性全站样式大提交。

每批验收：颜色来自 Token；圆角不超过 DESIGN.md 对应等级；正文 letter-spacing 为 0；无重叠、无不可读文本、无重型阴影。

### Task 11：完成 E2E、响应式和发布验收

**文件：**

- 修改：frontend/playwright.config.ts
- 修改：frontend/tests/e2e/auth.spec.ts
- 修改：frontend/tests/e2e/books.spec.ts
- 修改：frontend/tests/e2e/borrow.spec.ts
- 新建：frontend/tests/e2e/reservations.spec.ts
- 新建：frontend/tests/e2e/settings.spec.ts
- 新建：frontend/tests/e2e/visual-smoke.spec.ts

- [ ] 11.1 安装项目锁定版本的 Playwright 浏览器：

~~~powershell
cd frontend
npx.cmd playwright install
~~~

- [ ] 11.2 E2E 使用独立 QA 数据前缀和 afterAll 清理，禁止修改或删除现有业务数据。
- [ ] 11.3 覆盖 admin/user 两类登录、刷新深链、CRUD、借还续、预约、设置持久化。
- [ ] 11.4 视觉 smoke 在 1440x900、768x1024、390x844 截图，检查水平溢出和核心控件可见。
- [ ] 11.5 用 agent-browser 复跑测试报告中的 11 个问题，逐项标记已修复。
- [ ] 11.6 执行最终门禁：

~~~powershell
cd frontend
npm.cmd run lint
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build

cd ..\backend
npm.cmd test -- --runInBand
npm.cmd run build
~~~

- [ ] 11.7 检查 Chrome console/errors：无 403、404、未翻译键、未解析组件和 Vue prop 警告。
- [ ] 11.8 将最终截图保存到 test_screenshots/notion-regression，更新 QA 报告和发布清单。

预期：全部命令退出码 0，核心业务 E2E 全绿，三种视口通过人工视觉复核。提交建议：test: add end-to-end and responsive release gates

---

## 四、建议执行顺序

1. 第一轮：Task 1、2、3，先让权限和用户身份可信。
2. 第二轮：Task 4、5、6，完成图书、会员、借阅、预约、罚款主流程。
3. 第三轮：Task 7、8，消灭模拟数据和运行时警告。
4. 第四轮：Task 9，统一共享设计基础。
5. 第五轮：Task 10，按页面小批量迁移。
6. 第六轮：Task 11，完成全量回归和发布验收。

不要把 Task 9/10 提前到 P0 功能修复之前。当前视觉问题很明显，但先修样式会掩盖权限、身份和数据契约缺陷，并增加重复修改成本。

---

## 五、完成定义

- 普通用户注册后能够拥有有效会员档案，完成借阅、续借、归还、预约、取消和罚款查看。
- 管理员能够直接刷新任意管理路由，并完成图书、会员、借阅、预约、罚款、设置操作。
- 所有可见统计和图表来自真实 API；无硬编码业务数据和 setTimeout 模拟保存。
- 所有可见按钮均有真实动作、禁用理由或已移除。
- 登录后所有页面遵循 DESIGN.md：暖白画布、白色表面、近黑文字、单一蓝结构色、轻边框和轻阴影。
- 桌面、平板、手机无重叠、裁切、不可滚动表格或不可达操作。
- 浏览器控制台无应用级错误和警告。
- 前后端 lint、unit、E2E、build 全部通过。
