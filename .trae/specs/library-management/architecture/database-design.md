# 数据库设计

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本 | v1.0.0 |
| 更新日期 | 2025-03-27 |
| 作者 | Trae |

---

## 一、ER 图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │   members   │       │    books    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◀──┐   │ id (PK)     │       │ id (PK)     │
│ username    │   │   │ user_id(FK) │───┐   │ isbn        │
│ password    │   │   │ name        │   │   │ title       │
│ role        │   │   │ phone       │   │   │ author      │
│ created_at  │   │   │ id_card     │   │   │ category    │
│ updated_at  │   │   │ email       │   │   │ quantity    │
└─────────────┘   │   │ borrow_limit│   │   │ available   │
                  │   │ created_at  │   │   │ status      │
                  │   └─────────────┘   │   │ created_at  │
                  │                     │   └─────────────┘
                  │                     │          │
                  │                     │          │
                  │   ┌─────────────────┘          │
                  │   │                            │
                  │   ▼                            ▼
                  │   ┌─────────────┐       ┌─────────────┐
                  │   │borrow_records│      │reservations │
                  │   ├─────────────┤       ├─────────────┤
                  │   │ id (PK)     │       │ id (PK)     │
                  │   │ member_id(FK)│      │ member_id(FK)│
                  │   │ book_id (FK)│       │ book_id (FK)│
                  │   │ borrow_date │       │ reserve_date│
                  │   │ due_date    │       │ status      │
                  │   │ return_date │       │ created_at  │
                  │   │ status      │       └─────────────┘
                  │   │ renew_count │
                  │   └─────────────┘
                  │          │
                  │          ▼
                  │   ┌─────────────┐
                  │   │overdue_fines│
                  │   ├─────────────┤
                  │   │ id (PK)     │
                  │   │ record_id(FK)│
                  │   │ days        │
                  │   │ amount      │
                  │   │ status      │
                  │   └─────────────┘
                  │
                  └─────────────────────── 1:1 关联
```

---

## 二、数据表设计

### 2.1 users 表（用户表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| password | VARCHAR(255) | NOT NULL | 密码（bcrypt 加密） |
| role | ENUM('admin', 'user') | NOT NULL, DEFAULT 'user' | 角色 |
| status | TINYINT | DEFAULT 1 | 状态：1启用, 0禁用 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引**：
- PRIMARY KEY (id)
- UNIQUE INDEX idx_username (username)

### 2.2 members 表（会员表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| user_id | INT | FK, UNIQUE | 关联用户 ID |
| member_no | VARCHAR(20) | UNIQUE | 会员编号 |
| name | VARCHAR(50) | NOT NULL | 姓名 |
| phone | VARCHAR(20) | UNIQUE | 手机号 |
| id_card | VARCHAR(18) | UNIQUE | 身份证号 |
| email | VARCHAR(100) | | 邮箱 |
| gender | ENUM('male', 'female', 'other') | | 性别 |
| birth_date | DATE | | 出生日期 |
| borrow_limit | INT | DEFAULT 5 | 借阅上限 |
| current_borrow | INT | DEFAULT 0 | 当前借阅数 |
| status | TINYINT | DEFAULT 1 | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引**：
- PRIMARY KEY (id)
- UNIQUE INDEX idx_user_id (user_id)
- UNIQUE INDEX idx_member_no (member_no)
- UNIQUE INDEX idx_phone (phone)
- UNIQUE INDEX idx_id_card (id_card)

### 2.3 books 表（书籍表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| isbn | VARCHAR(20) | UNIQUE, NOT NULL | ISBN |
| title | VARCHAR(200) | NOT NULL | 书名 |
| author | VARCHAR(100) | | 作者 |
| publisher | VARCHAR(100) | | 出版社 |
| publish_date | DATE | | 出版日期 |
| category | VARCHAR(50) | | 分类 |
| description | TEXT | | 简介 |
| cover_url | VARCHAR(500) | | 封面图片 URL |
| quantity | INT | DEFAULT 0 | 总库存 |
| available | INT | DEFAULT 0 | 可借数量 |
| location | VARCHAR(50) | | 馆藏位置 |
| status | ENUM('available', 'unavailable', 'maintenance') | DEFAULT 'available' | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引**：
- PRIMARY KEY (id)
- UNIQUE INDEX idx_isbn (isbn)
- INDEX idx_title (title)
- INDEX idx_author (author)
- INDEX idx_category (category)

### 2.4 borrow_records 表（借阅记录表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| member_id | INT | FK, NOT NULL | 会员 ID |
| book_id | INT | FK, NOT NULL | 书籍 ID |
| borrow_date | DATE | NOT NULL | 借阅日期 |
| due_date | DATE | NOT NULL | 应还日期 |
| return_date | DATE | | 实际归还日期 |
| renew_count | INT | DEFAULT 0 | 续借次数 |
| status | ENUM('borrowed', 'returned', 'overdue') | DEFAULT 'borrowed' | 状态 |
| operator_id | INT | FK | 操作员 ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引**：
- PRIMARY KEY (id)
- INDEX idx_member_id (member_id)
- INDEX idx_book_id (book_id)
- INDEX idx_status (status)
- INDEX idx_borrow_date (borrow_date)

### 2.5 reservations 表（预约表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| member_id | INT | FK, NOT NULL | 会员 ID |
| book_id | INT | FK, NOT NULL | 书籍 ID |
| reserve_date | TIMESTAMP | NOT NULL | 预约时间 |
| expire_date | TIMESTAMP | | 过期时间 |
| status | ENUM('pending', 'notified', 'completed', 'cancelled', 'expired') | DEFAULT 'pending' | 状态 |
| queue_position | INT | | 队列位置 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引**：
- PRIMARY KEY (id)
- INDEX idx_member_id (member_id)
- INDEX idx_book_id (book_id)
- INDEX idx_status (status)
- INDEX idx_book_status (book_id, status)

### 2.6 overdue_fines 表（逾期费用表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| record_id | INT | FK, NOT NULL | 借阅记录 ID |
| member_id | INT | FK, NOT NULL | 会员 ID |
| overdue_days | INT | NOT NULL | 逾期天数 |
| amount | DECIMAL(10, 2) | NOT NULL | 费用金额 |
| paid_amount | DECIMAL(10, 2) | DEFAULT 0 | 已付金额 |
| status | ENUM('unpaid', 'partial', 'paid') | DEFAULT 'unpaid' | 状态 |
| paid_at | TIMESTAMP | | 支付时间 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引**：
- PRIMARY KEY (id)
- INDEX idx_record_id (record_id)
- INDEX idx_member_id (member_id)
- INDEX idx_status (status)

### 2.7 data_dict 表（数据字典表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| category | VARCHAR(50) | NOT NULL | 字典分类 |
| code | VARCHAR(50) | NOT NULL | 字典编码 |
| label | VARCHAR(100) | NOT NULL | 显示文本 |
| value | VARCHAR(100) | NOT NULL | 字典值 |
| sort | INT | DEFAULT 0 | 排序 |
| parent_id | INT | DEFAULT 0 | 父级 ID |
| status | TINYINT | DEFAULT 1 | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**：
- PRIMARY KEY (id)
- UNIQUE INDEX idx_category_code (category, code)

---

## 三、表关系说明

| 关系 | 类型 | 说明 |
|------|------|------|
| users - members | 1:1 | 一个用户对应一个会员 |
| members - borrow_records | 1:N | 一个会员有多条借阅记录 |
| books - borrow_records | 1:N | 一本书有多条借阅记录 |
| members - reservations | 1:N | 一个会员有多条预约 |
| books - reservations | 1:N | 一本书有多条预约 |
| borrow_records - overdue_fines | 1:1 | 一条借阅记录对应一条费用 |

---

## 四、业务规则约束

### 4.1 借阅规则

```sql
-- 借阅前检查：会员当前借阅数不能超过上限
SELECT current_borrow, borrow_limit FROM members WHERE id = ?;
-- 条件: current_borrow < borrow_limit

-- 借阅前检查：书籍可借数量必须大于 0
SELECT available FROM books WHERE id = ?;
-- 条件: available > 0
```

### 4.2 预约规则

```sql
-- 预约前检查：书籍可借数量必须为 0
SELECT available FROM books WHERE id = ?;
-- 条件: available = 0

-- 预约前检查：会员预约数不能超过上限（3本）
SELECT COUNT(*) FROM reservations 
WHERE member_id = ? AND status IN ('pending', 'notified');
-- 条件: count < 3
```

### 4.3 逾期费用计算

```sql
-- 计算逾期天数
DATEDIFF(return_date, due_date) as overdue_days

-- 计算费用：逾期天数 × 0.5元/天
overdue_days * 0.5 as amount
```

---

## 五、数据迁移脚本示例

### 5.1 创建初始管理员

```sql
INSERT INTO users (username, password, role, status) 
VALUES ('admin', '$2b$10$...', 'admin', 1);
```

### 5.2 创建初始会员

```sql
INSERT INTO members (user_id, member_no, name, phone, id_card, borrow_limit)
VALUES (1, 'M20240001', '管理员', '13800138000', '110101199001011234', 5);
```
